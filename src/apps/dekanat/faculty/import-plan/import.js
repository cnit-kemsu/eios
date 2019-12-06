

import React from 'react'
import { css } from '@emotion/core'
import { Button } from '@kemsu/eios-ui'

import { fetchDevApi as fetchApi } from 'share/utils'

import * as xmlGen from './xml'
import * as plxGen from './plx'
import * as osfGen from './osf'

const missingBlockRowCss = css`
    display: flex;
    padding: 2px 0px;
`

const ErrorOutput = ({ err }) => (
    <div>
        <h1>Возникла ошибка! По возможности, сообщите об этом администратору.</h1>
        <pre>{err.stack}</pre>
    </div>
)

const typeGenMap = {
    xml: xmlGen,
    plx: plxGen,
    osf: osfGen
}


function isRealNumber(numb) {
    return typeof numb === 'string' && numb.indexOf(".") !== -1
}

function convNumbToOracleFmt(numb) {
    if (typeof numb === 'string') {
        return numb.replace('.', ',')
    }
    return numb
}

export default async function importPlan(self, xml, type) {

    try {

        const gen = typeGenMap[type]

        let planInfo = gen.getPlanInfo(self, xml)

        if (planInfo.learnForm.toLowerCase() !== self.state.plan.FORM_LEARN.toLowerCase()) {
            self.setState({
                message: `Форма обучения в плане (${planInfo.learnForm}) не совпадает с формой обучения в стандарте (${self.state.plan.FORM_LEARN})!`,
                messageType: "error"
            })
            return
        }

        if (+planInfo.years > +self.state.plan.STUDY_TERM.replace(',', '.')) {
            self.setState({
                message: `Срок обучения в плане (${planInfo.years}) превышает срок обучения в стандарте (${self.state.plan.STUDY_TERM})!`,
                messageType: "error"
            })
            return
        }

        let blocks = gen.getBlocksFrom(self, xml)
        let planRows = gen.getPlanRowsFrom(self, xml)
        let teachingPractices = gen.getPracticesFrom(self, xml, "У")
        let prodPractices = gen.getPracticesFrom(self, xml, "П")
        let searchingPractices = gen.getPracticesFrom(self, xml, "Н")
        let undergradPractices = gen.getPracticesFrom(self, xml, "Пд")
        let simPractices = gen.getPracticesFrom(self, xml, "С")
        let prepVKRPractices = gen.getPracticesFrom(self, xml, "Д")
        let prepGIAPractices = gen.getPracticesFrom(self, xml, "Г")
        let graphic = gen.getGraphicFrom(self, xml)

        // Определим строки плана, которые являются модулями
        for (const planRow of planRows) {
            for (const { code: childCode } of planRows) {
                if (planRow.code.length < childCode.length && childCode.startsWith(planRow.code + '.')) {
                    planRow.discTypeId = 7540
                }

            }
        }

        let subblocks = []

        // Определим подблоки и добавим их к списку строк плана
        blocks.forEach(function (block) {
            if (block.isSubblock) {
                subblocks.push({
                    name: block.name,
                    code: block.code,
                    discTypeId: 7541
                })
            }
        })

        planRows = subblocks.concat(planRows)

        // Объединяем практики со строками планами
        planRows = planRows.concat(teachingPractices).concat(prodPractices).concat(searchingPractices)
            .concat(undergradPractices).concat(simPractices).concat(prepVKRPractices).concat(prepGIAPractices)

        // Сортируем строки плана по коду (для того, чтобы родители создавались раньше дочерних элементов)
        // TODO: возможно лишнее, так как ниже будет еще одна сортировка. Удалить?
        planRows.sort((a, b) => (a.code < b.code ? -1 : (a.code > b.code ? 1 : 0)))

        // Для заочных планов перенумеруем семестры. Первые семестры каждого курса станут установочными
        if (planInfo.learnForm.toLowerCase() === 'заочная') {
            planRows = planRows.map(planRow => {

                let semesters = planRow.semesters

                if (!semesters) return planRow

                for (let semester of semesters) {

                    let relSemNum = (semester.num - 1) % 3 + 1
                    let course = Math.floor((semester.num - 1) / 3) + 1

                    if (relSemNum === 1) {
                        semester.course = course
                        semester.num = undefined
                        semester.isAdj = true

                    } else {
                        semester.num = semester.num - course
                    }
                }

                return planRow

            })
        }

        let parents = {};

        planRows.forEach(function (row) {

            let code = row.code;

            // Для элективного курса по физ-ре нет кода, но она содержится в модуле Б1.В.ДВ
            if (code === "") {
                code = "Б1.В.ДВ.0";
            }

            let parts = code.split(".");

            for (let i = 1; i < parts.length - 1; ++i) {

                let parentCode = parts.slice(0, i + 1).join(".")
                let parentType = !parentCode.endsWith("ДВ") && parentCode.indexOf("ДВ") != -1 ? 1249 : 7540

                if (planRows.some((planRow) => planRow.code === parentCode)) continue

                if (!parents[parentCode]) {
                    parents[parentCode] = parentType
                }
            }
        })

        // Определеям максимальный номер семестра, для которого есть данные
        let maxSemNum = 0

        for (let pr of planRows) {

            if (!pr.semesters) continue

            for (let semester of pr.semesters) {
                let { num } = semester
                if (maxSemNum < num) maxSemNum = num
            }
        }

        const maxCourseNum = maxSemNum / 2

        let yyyy = Math.ceil(+(planInfo.years.replace(',', '.')))

        // Возможно срок обучения не совпадает с количеством курсов, проверим это
        if (maxCourseNum > yyyy) {

            let hasCourseMap = {}

            // Определим кол-во курсов по графику
            for (let g of graphic) {
                hasCourseMap[g.course] = true
            }

            // Сравним
            if (Object.keys(hasCourseMap).length > yyyy) {
                self.setState({ message: 'Срок обучения не совпадает с количеством курсов!', messageType: "error", importing: false })
                return
            }
        }

        // Отфильтруем семестры, которые не попадают в график
        if (graphic.length !== 0) {
            for (let planRow of planRows) {

                if (!planRow.semesters) continue

                planRow.semesters = planRow.semesters.filter(({ course, num }) => {

                    for (let { course: grCourse } of graphic) {
                        if (grCourse === course || grCourse === (Math.floor((num - 1) / 2) + 1)) {
                            return true
                        }
                    }

                    return false

                })
            }
        }

        /*console.log('planInfo', planInfo)
        console.log('blocks', blocks)
        console.log('planRows', planRows)
        console.log('teachingPractices', teachingPractices)
        console.log('prodPractices', prodPractices)
        console.log('searchingPractices', searchingPractices)
        console.log('undergradPractices', undergradPractices)
        console.log('simPractices', simPractices)
        console.log('prepVKRPractices', prepVKRPractices)
        console.log('prepGIAPractices', prepGIAPractices)
        console.log('graphic', graphic)
        return*/

        const { planId, plan, specialization, planType } = self.state

        // Проверка отсутствующих блоков в стандарте 
        let response = await fetchApi(`dekanat/plans/${planId}/plain-discipline-tree`)

        if (!response.ok) {
            self.setState({ message: <ErrorOutput err={await response.json()} />, messageType: "error", importing: false })
            return
        }

        let data = await response.json()

        let missingBlocks = []

        blocks.forEach((blockFromXml) => {
            if (!data.tree.some((blockFromStandard) => {
                return blockFromXml.isSubblock || blockFromXml.code === "Б4" || blockFromStandard.code === blockFromXml.code;
            })) {
                missingBlocks.push(blockFromXml);
            }
        })

        if (missingBlocks.length > 0) {
            self.setState({
                message: (
                    <div>
                        <h3>XML-файл содержит блоки, которые отсутствуют в стандарте:</h3>
                        {
                            missingBlocks.map(({ code, name }, i) => (
                                <div key={i} className={missingBlockRowCss}>
                                    <div style={{ width: "40px", marginRight: "8px" }}>{code}</div>
                                    <div>{name}</div>
                                </div>
                            ))
                        }
                        <br />
                        <a href='https://niais2.kemsu.ru/dekanat/plan/gost/addplan.htm'>Перейти к созданию нового стандарта</a>
                        <span style={{ margin: "0px 4px" }}>|</span>
                        <a href={`https://niais2.kemsu.ru/dekanat/plan/gost/dochoiceplan.htm?in_id=${planId}`}>Перейти к редактированию текущего стандарта</a>

                    </div>
                ),
                messageType: "error", importing: false

            })
            return
        }

        // Проверяем отсутствующие в словаре названия дисциплин

        let response2 = await fetchApi("glossary/dictionaries/dic_education/missing-item-titles", {
            method: "post",
            body: JSON.stringify({
                group: "132",
                itemTitles: planRows.map(planRow => planRow.name)
            })
        })

        if (!response2.ok) {
            self.setState({ message: <ErrorOutput err={await response2.json()} />, messageType: "error", importing: false, forcedImport: false })
            return
        }

        let missingDisciplines = (await response2.json()).missingItems

        // Если имеются дисциплины, отсутствующие в словаре
        if (missingDisciplines.length > 0) {

            let resolve, reject, addMissingDisciplines = async () => {

                self.setState({
                    message: null
                })

                response = await fetchApi("glossary/dictionaries/dic_education/item-titles", {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: "post",
                    body: JSON.stringify({
                        group: "132",
                        itemTitles: missingDisciplines
                    })
                })

                if (!response.ok) {
                    reject(<ErrorOutput err={await response.json()} />)
                    return
                }

                let data = await response.json()

                if (data.errors.length === 0) {
                    resolve()
                } else {
                    reject({
                        message: (
                            <div>
                                <h1>Имеются дисциплины, которые не удалось добавить в словарь!</h1>
                                {
                                    data.errors.map((item, i) => (
                                        <div key={i} style={{ padding: "4px 0px" }}>{item.itemTitle}</div>
                                    ))
                                }
                            </div>
                        )
                    })
                }
            }

            let promise = new Promise((res, rej) => {
                resolve = res
                reject = rej
            })

            self.setState({
                message: (
                    <div>
                        <h3>Файл содержит дисциплины, которые отсутствуют в словаре:</h3>
                        <ol>
                            {
                                missingDisciplines.map(item => (
                                    <li>{item}</li>
                                ))
                            }
                        </ol>
                        <Button colorStyle='primary' onClick={addMissingDisciplines}>Добавить дисциплины в словарь</Button>
                    </div>
                ),
                messageType: "error"
            })

            await promise
        }

        // Объединяем ранее найденные родительские элементы (явно не прописанные в файле плана) со строками плана
        let planRows2 = (Object.keys(parents).map(function (key) {
            return {
                code: key,
                discTypeId: parents[key]
            }
        })).concat(planRows)

        // Сортируем
        //planRows2.sort((a, b) => (a.code < b.code ? -1 : (a.code > b.code ? 1 : 0)))

        // Определяем наличие часов и зетов с вещественным значением
        let realHourFlag = false

        for (const { semesters = [] } of planRows2) {
            for (const s of semesters) {

                const { kre, krgia, krkp, krkr, krpr, ksr, lab, lecture, pract, srs, zet } = s

                realHourFlag = realHourFlag || isRealNumber(kre); s.kre = convNumbToOracleFmt(s.kre)
                realHourFlag = realHourFlag || isRealNumber(krgia); s.krgia = convNumbToOracleFmt(s.krgia)
                realHourFlag = realHourFlag || isRealNumber(krkp); s.krkp = convNumbToOracleFmt(s.krkp)
                realHourFlag = realHourFlag || isRealNumber(krkr); s.krkr = convNumbToOracleFmt(s.krkr)
                realHourFlag = realHourFlag || isRealNumber(krpr); s.krpr = convNumbToOracleFmt(s.krpr)
                realHourFlag = realHourFlag || isRealNumber(ksr); s.ksr = convNumbToOracleFmt(s.ksr)
                realHourFlag = realHourFlag || isRealNumber(lab); s.lab = convNumbToOracleFmt(s.lab)
                realHourFlag = realHourFlag || isRealNumber(lecture); s.lecture = convNumbToOracleFmt(s.lecture)
                realHourFlag = realHourFlag || isRealNumber(pract); s.pract = convNumbToOracleFmt(s.pract)
                realHourFlag = realHourFlag || isRealNumber(srs); s.srs = convNumbToOracleFmt(s.srs)
                realHourFlag = realHourFlag || isRealNumber(zet); s.zet = convNumbToOracleFmt(s.zet)
            }
        }

        // В случае наличия вещественых значений у часов или зетов, запросим подтверждение импорта
        if (realHourFlag && !self.state.forcedImport) {
            self.setState({ needConfirmImport: true, message: 'План содержит часы/ЗЕТы значения которых не является целым.', messageType: 'warning' })
            return
        }

        const reqPlanData = {
            study_term: planInfo.years,
            learn_start_date: new Date(self.startDateRef.current.value).toLocaleDateString(),
            learn_end_date: new Date(self.endDateRef.current.value).toLocaleDateString(),
            plan_id: +planId,
            form_learn_id: +plan.FORM_LEARN_ID,
            faculty_id: +plan.FACULTY_ID,
            speciality_id: +plan.SPECIALITY_ID,
            specialization_id: (+specialization) === 0 ? null : +specialization,
            qualification_id: +plan.QUALIFICATION_ID,
            plan_type_id: 125,
            plan_status_id: 122, // статус - редактируется
            plan_kind_id: +planType,
            date_confirm: planInfo.approvalDate && planInfo.approvalDate.toLocaleDateString()
        }       

        // Создадим план
        let response3 = await fetchApi('dekanat/plans/importer', {
            method: "post",
            body: JSON.stringify(reqPlanData)
        })

        if (!response3.ok) {
            self.setState({ message: <ErrorOutput err={await response3.json()} />, messageType: "error", importing: false, forcedImport: false })
            return
        }

        // ID созданного плана
        let newPlanId = (await response3.json()).result

        // Создаем графики
        let response4 = await fetchApi("dekanat/plans/importer/graphics", {
            method: "post",
            body: JSON.stringify({
                planId: newPlanId,
                graphic: graphic
            })
        })

        if (!response4.ok) {
            self.setState({ message: <ErrorOutput err={await response4.json()} />, messageType: "error", importing: false, forcedImport: false })
            return
        }

        // Заносим строки плана
        let response5 = await fetchApi("dekanat/plans/importer/plan-rows", {
            method: "post",
            body: JSON.stringify({
                planId: newPlanId,
                planRows: planRows2
            })
        })

        if (!response5.ok) {
            self.setState({ message: <ErrorOutput err={await response5.json()} />, messageType: "error", importing: false, forcedImport: false })
            return
        }

        // Переходим к созданному плану
        window.location = `https://niais2.kemsu.ru/dekanat/plan/work/dochoiceplan.htm?x=7&y=10&in_id=${newPlanId}`

    } catch (err) {
        self.setState({ message: err.stack || err.message, messageType: 'error', importing: false })
    }
}