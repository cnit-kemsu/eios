import saveFile from 'save-file'
import React, { useState, useEffect, useCallback } from 'react'

import { Select, Table, Button, Checkbox, useSelect, useSelectWithSetter, useCheckbox } from '@kemsu/eios-ui'
import { fetchApi } from 'share/utils'
import { getFacultyInfo } from 'share/utils'

import Loading from 'share/eios/Loading'

import { css } from '@emotion/core'
import { topbarLinks } from './links'



function strProcToNumb(str) {
    return +str.replace(',', '.')
}

function numbProcToStr(numb) {
    return ('' + Math.floor(numb * 100) / 100).replace('.', ',')
}


const DataRow = ({ title, children }) => (
    <div style={{ padding: '6px 0px' }}>
        <span style={{ width: '250px', display: 'inline-block', fontWeight: 'bold' }}>{title}: </span>
        <span>{children}</span>
    </div>
)

const rowCss = css`
    display: flex;
    align-items: center;
`


function Session({ id, bindingDates, onChecked, onSelect }) {

    const select = useSelect(0, onSelect)
    const checkbox = useCheckbox(false, onChecked)

    return (
        <div css={rowCss}>
            <Checkbox {...checkbox}>Сессия №{id}</Checkbox>
            <Select {...select} items={bindingDates} />
        </div>
    )
}


export function Page({ setError }) {

    const [learnYearSelect, setLearnYear] = useSelectWithSetter(0, () => {
        setSessList([])
        setReport([])
    })
    const [learnYears, setLearnYears] = useState([])

    const [sessTypeSelect, setSessType] = useSelectWithSetter("", () => {
        setSessList([])
        setReport([])
    })
    const [sessTypes, setSessTypes] = useState([])

    const [sessList, setSessList] = useState([])


    const handleChooseClick = useCallback(async () => {
        try {

            setReport([])

            const { id: facultyId } = getFacultyInfo()

            let response = await fetchApi(`dekanat/reports/sess-report/sess-list?sessType=${sessTypeSelect.value}&learnYear=${learnYears[learnYearSelect.value]}&facultyId=${facultyId}`, null, true, true)
            let json = await response.json()            

            let list = []

            for (const id of json) {

                response = await fetchApi(`dekanat/reports/sess-report/binding-dates?sessType=${sessTypeSelect.value}&learnYear=${learnYears[learnYearSelect.value]}&facultyId=${facultyId}&sessId=${id}`)
                const bindingDates = await response.json()
                list.push({ id, checked: false, bindingDates, bindingDate: bindingDates[0] })

            }

            setSessList(list)

        } catch (err) {
            setError(err)
        }

    }, [learnYearSelect.value, learnYears, sessTypeSelect.value, setError])

    const [creatingReportFlag, setCreatingReportFlag] = useState(false)
    const [report, setReport] = useState([])

    const createReport = useCallback(async () => {

        try {
            setCreatingReportFlag(true)
            setReport([])

            const { id: facultyId } = getFacultyInfo()

            let r = []

            for (let { id: sessId, checked, bindingDate } of sessList) {

                if (!checked) continue

                for (let course = 1; course <= 6; ++course) {

                    const response = await fetchApi(`dekanat/reports/sess-report?facultyId=${facultyId}&sessType=${sessTypeSelect.value}&learnYear=${learnYears[learnYearSelect.value]}&course=${course}&sessId=${sessId}&bindingDate=${bindingDate}`, null, true, true)
                    const json = await response.json()

                    r = r.concat(json)

                }
            }            

            setReport(r)

        } catch (err) {
            setError(err)
        } finally {
            setCreatingReportFlag(false)
        }

    }, [learnYearSelect.value, learnYears, sessList, sessTypeSelect.value, setError])

    function getTableAsHTMLText() {
        let html = document.getElementById("downloadTable").outerHTML
        return html.replace(/<table[^>]+>/, '<table border="1">')
    }

    const handleDownloadHTMLClick = useCallback(async () => {
        await saveFile(new Blob([getTableAsHTMLText()]), 'отчет_по_итогам_сессий.html')
    }, [])

    const handleDownloadXLSClick = useCallback(async () => {
        await saveFile(new Blob([getTableAsHTMLText()]), 'отчет_по_итогам_сессий.xls')
    }, [])

    useEffect(() => {

        (async () => {

            try {

                const { id: facultyId } = getFacultyInfo()

                let response = await fetchApi(`dekanat/reports/sess-report/learn-years?facultyId=${facultyId}`, null, true, true)
                let json = await response.json()

                setLearnYears(json)
                setLearnYear(0)

                response = await fetchApi('dekanat/reports/sess-report/sess-types', null, true, true)
                json = await response.json()

                setSessTypes(json.map(({ id, title }) => ({ value: id, content: title })))
                setSessType(json[0].id)

            } catch (err) {
                setError(err)
            }

        })()

    }, [setError, setLearnYear, setSessType])

    let j = 0

    const totalInfo = {
        COUNT: 0, GROUPS_CNT: 0, STUDENTS_CNT: 0, AKADEM_CNT: 0, OUT_CNT: 0, MUST_EXAM: 0,
        INDIV_GRAPH: 0, NOT_EXISTS_VALID: 0, EXAM_3: 0, EXAM_3_PROC: 0, GROUPS_NAME: 0, RESULT_PROC: 0,
        EXAM_45: 0, EXAM_45_PROC: 0, EXAM_5: 0, EXAM_5_PROC: 0, EXAM_ALL: 0, EXAM_ALL_PROC: 0, LOSERS: 0,
        LOSERS_PROC: 0, CREDITED: 0, CREDITED_PROC: 0, NO_CREDITED: 0, NO_CREDITED_PROC: 0, VALID_PROC: 0, SRED_BALL: 0
    }

    return (
        <React.Fragment>

            <DataRow title="Учебный год">
                <Select items={learnYears} {...learnYearSelect} />
            </DataRow>

            <DataRow title="Тип сессии">
                <Select items={sessTypes} {...sessTypeSelect} />
            </DataRow>

            <Button onClick={handleChooseClick} disabled={learnYearSelect.value === undefined || !sessTypeSelect.value === undefined} colorStyle="primary">Выбрать</Button>

            <br />
            <br />

            {sessList.map(({ id, bindingDates }, i) => (
                <React.Fragment key={i}>
                    <Session id={id} bindingDates={bindingDates}
                        onChecked={checked => {
                            sessList[i].checked = checked
                            setSessList(sessList)
                        }}
                        onSelect={value => {                                                  
                            sessList[i].bindingDate = bindingDates[value]
                            setSessList(sessList)
                        }}
                    />
                    <br />
                </React.Fragment>
            ))}

            <br />

            {sessList.length > 0 && <Button onClick={createReport} disabled={creatingReportFlag} colorStyle="primary">Сформировать отчет</Button>}

            <br />
            <br />

            <Loading loading={creatingReportFlag} delay={1}>
                {report.length > 0 && (
                    <>
                        <Table id="downloadTable">
                            <thead>
                                <tr align="center" style={{ verticalAlign: "middle" }}>

                                    <th rowSpan="3">
                                        Курс
                            </th>
                                    <th rowSpan="3">
                                        Группа
                            </th>

                                    <th colSpan="6">
                                        Количество студентов
                            </th>
                                    <th colSpan="17">
                                        Результаты экзаменационной сессии
                            </th>
                                </tr >
                                <tr align="center" style={{ verticalAlign: "middle" }}>
                                    <th rowSpan="2">
                                        Всего<br />
                                    студентов
                            </th>
                                    <th rowSpan="2">
                                        В акад.<br />
                                    отпуске
                            </th>
                                    <th rowSpan="2">
                                        Отчисл.
                            </th>
                                    <th rowSpan="2">
                                        Обязаны<br />
                                    сдавать<br />
                                    экзамены
                            </th>
                                    <th rowSpan="2">
                                        Индив.<br />
                                    график
                            </th>
                                    <th rowSpan="2">
                                        Продление<br />
                                    сессии<br />

                                    (неявка по<br />
                                    уваж. причине)
                            </th>
                                    <th rowSpan="2">
                                        Сдали зач.<br />
                                    и экз. по<br />
                                    всем<br />
                                    предметам
                            </th>
                                    <th rowSpan="2">
                                        <b>
                                            %, успе-<br />
                                        ваемости
                            </b>
                                    </th>
                                    <th colSpan="7">
                                        В том числе по всем предметам сдали
                        </th>
                                    <th rowSpan="2">
                                        Неявка без<br />
                                    уважит.<br />
                                    причины,<br />
                                    "неуд" или<br />
                                    незачёт<br />
                                    по одному<br />
                                    или нескольким<br />
                                    предметам
                        </th>
                                    <th rowSpan="2">
                                        %, задолж-<br />
                                    ников
                        </th>
                                    <th rowSpan="2">
                                        Сдали зачеты
                        </th>
                                    <th rowSpan="2">
                                        %, зач.
                        </th>
                                    <th rowSpan="2">
                                        Не сдали зачеты
                        </th>
                                    <th rowSpan="2">
                                        %, незач.
                            </th>
                                    <th rowSpan="2">
                                        %, не сдавших<br />
                                    сессию по<br />
                                    уваж. причине:<br />
                                    инд. график,<br />
                                    продление
                        </th>
                                    <th rowSpan="2">
                                        Сред.<br />
                                    балл
                        </th>
                                </tr>
                                <tr align="center" style={{ verticalAlign: "middle" }}>
                                    <th>
                                        Только на<br />
                                    "5"
                        </th>
                                    <th>
                                        %, только<br />
                                    на "5"
                        </th>
                                    <th>
                                        На "4",<br />
                                    "5" и "4"
                        </th>
                                    <th>
                                        %, на "4", <br />
                                    "5" и "4"
                        </th>
                                    <th>
                                        <b>
                                            %, кач.<br />
                                        успевае-<br />
                                        мости
                            </b>
                                    </th>
                                    <th>
                                        На "3"
                        </th>
                                    <th>
                                        %, на "3"
                        </th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.map(({
                                    COURSE, GROUPS_CNT, STUDENTS_CNT, AKADEM_CNT, OUT_CNT, MUST_EXAM,
                                    INDIV_GRAPH, NOT_EXISTS_VALID, EXAM_3, EXAM_3_PROC, GROUPS_NAME, RESULT_PROC,
                                    EXAM_45, EXAM_45_PROC, EXAM_5, EXAM_5_PROC, EXAM_ALL, EXAM_ALL_PROC, LOSERS,
                                    LOSERS_PROC, CREDITED, CREDITED_PROC, NO_CREDITED, NO_CREDITED_PROC, VALID_PROC, SRED_BALL
                                }, index) => {

                                    if (!GROUPS_NAME) {
                                        j = -1

                                        ++totalInfo.COUNT;

                                        totalInfo.GROUPS_CNT += GROUPS_NAME
                                        totalInfo.STUDENTS_CNT += STUDENTS_CNT
                                        totalInfo.AKADEM_CNT += AKADEM_CNT
                                        totalInfo.OUT_CNT += OUT_CNT
                                        totalInfo.MUST_EXAM += MUST_EXAM
                                        totalInfo.INDIV_GRAPH += INDIV_GRAPH
                                        totalInfo.NOT_EXISTS_VALID += NOT_EXISTS_VALID
                                        totalInfo.EXAM_3 += EXAM_3
                                        totalInfo.EXAM_3_PROC += strProcToNumb(EXAM_3_PROC)
                                        totalInfo.EXAM_45 += EXAM_45
                                        totalInfo.EXAM_45_PROC += strProcToNumb(EXAM_45_PROC)
                                        totalInfo.EXAM_5 += EXAM_5
                                        totalInfo.EXAM_5_PROC += strProcToNumb(EXAM_5_PROC)
                                        totalInfo.EXAM_ALL += EXAM_ALL
                                        totalInfo.EXAM_ALL_PROC += strProcToNumb(EXAM_ALL_PROC)
                                        totalInfo.LOSERS += LOSERS
                                        totalInfo.LOSERS_PROC += strProcToNumb(LOSERS_PROC)
                                        totalInfo.CREDITED += CREDITED
                                        totalInfo.CREDITED_PROC += strProcToNumb(CREDITED_PROC)
                                        totalInfo.NO_CREDITED += NO_CREDITED
                                        totalInfo.NO_CREDITED_PROC += strProcToNumb(NO_CREDITED_PROC)
                                        totalInfo.VALID_PROC += strProcToNumb(VALID_PROC)
                                        totalInfo.SRED_BALL += strProcToNumb(SRED_BALL)
                                    }

                                    return (

                                        <tr key={index} align="center" >

                                            {j++ == 0 &&
                                                <td rowSpan={GROUPS_CNT}>
                                                    {COURSE}
                                                </td>}

                                            {GROUPS_NAME &&
                                                <td>
                                                    {GROUPS_NAME}
                                                </td>}

                                            {!GROUPS_NAME &&
                                                <td colSpan="2" align="right">
                                                    Итого по<br />
                                                курсу:&nbsp;
                            </td>}

                                            <td>
                                                {STUDENTS_CNT}
                                            </td>
                                            <td>
                                                {AKADEM_CNT}
                                            </td>
                                            <td>
                                                {OUT_CNT}
                                            </td>
                                            <td>
                                                {MUST_EXAM}
                                            </td>
                                            <td>
                                                {INDIV_GRAPH}
                                            </td>
                                            <td>
                                                {NOT_EXISTS_VALID}
                                            </td>
                                            <td>
                                                {EXAM_ALL}
                                            </td>
                                            <td>
                                                {EXAM_ALL_PROC}
                                            </td>
                                            <td>
                                                {EXAM_5}
                                            </td>
                                            <td>
                                                {EXAM_5_PROC}
                                            </td>
                                            <td>
                                                {EXAM_45}
                                            </td>
                                            <td>
                                                {EXAM_45_PROC}
                                            </td>
                                            <td>
                                                {RESULT_PROC}
                                            </td>
                                            <td>
                                                {EXAM_3}
                                            </td>
                                            <td>
                                                {EXAM_3_PROC}
                                            </td>
                                            <td>
                                                {LOSERS}
                                            </td>
                                            <td>
                                                {LOSERS_PROC}
                                            </td>
                                            <td>
                                                {CREDITED}
                                            </td>
                                            <td>
                                                {CREDITED_PROC}
                                            </td>
                                            <td>
                                                {NO_CREDITED}
                                            </td>
                                            <td>
                                                {NO_CREDITED_PROC}
                                            </td>
                                            <td>
                                                {VALID_PROC}
                                            </td>
                                            <td>
                                                {SRED_BALL}
                                            </td>
                                        </tr>

                                    )
                                })}
                                <tr align="center" style={{ fontWeight: "bold" }} >

                                    <td colSpan="2" align="right">
                                        Итого по<br />
                                    курсам:&nbsp;
                                </td>

                                    <td>
                                        {totalInfo.STUDENTS_CNT}
                                    </td>
                                    <td>
                                        {totalInfo.AKADEM_CNT}
                                    </td>
                                    <td>
                                        {totalInfo.OUT_CNT}
                                    </td>
                                    <td>
                                        {totalInfo.MUST_EXAM}
                                    </td>
                                    <td>
                                        {totalInfo.INDIV_GRAPH}
                                    </td>
                                    <td>
                                        {totalInfo.NOT_EXISTS_VALID}
                                    </td>
                                    <td>
                                        {totalInfo.EXAM_ALL}
                                    </td>
                                    <td>
                                        {numbProcToStr(totalInfo.EXAM_ALL_PROC / totalInfo.COUNT)}
                                    </td>
                                    <td>
                                        {totalInfo.EXAM_5}
                                    </td>
                                    <td>
                                        {numbProcToStr(totalInfo.EXAM_5_PROC / totalInfo.COUNT)}
                                    </td>
                                    <td>
                                        {totalInfo.EXAM_45}
                                    </td>
                                    <td>
                                        {numbProcToStr(totalInfo.EXAM_45_PROC / totalInfo.COUNT)}
                                    </td>
                                    <td>
                                        {numbProcToStr(totalInfo.RESULT_PROC / totalInfo.COUNT)}
                                    </td>
                                    <td>
                                        {totalInfo.EXAM_3}
                                    </td>
                                    <td>
                                        {numbProcToStr(totalInfo.EXAM_3_PROC / totalInfo.COUNT)}
                                    </td>
                                    <td>
                                        {totalInfo.LOSERS}
                                    </td>
                                    <td>
                                        {numbProcToStr(totalInfo.LOSERS_PROC / totalInfo.COUNT)}
                                    </td>
                                    <td>
                                        {totalInfo.CREDITED}
                                    </td>
                                    <td>
                                        {numbProcToStr(totalInfo.CREDITED_PROC / totalInfo.COUNT)}
                                    </td>
                                    <td>
                                        {totalInfo.NO_CREDITED}
                                    </td>
                                    <td>
                                        {numbProcToStr(totalInfo.NO_CREDITED_PROC / totalInfo.COUNT)}
                                    </td>
                                    <td>
                                        {numbProcToStr(totalInfo.VALID_PROC / totalInfo.COUNT)}
                                    </td>
                                    <td>
                                        {numbProcToStr(totalInfo.SRED_BALL / totalInfo.COUNT)}
                                    </td>

                                </tr>
                            </tbody>
                        </Table>

                        <br /><br />

                        <div css={rowCss}>
                            <span style={{ marginRight: '8px' }}>Выдать на печать: </span>
                            <img title="Печать в HTML" src="https://public.kemsu.ru/icons/expl.jpg" style={{ marginRight: '8px', cursor: 'pointer' }} onClick={handleDownloadHTMLClick} />
                            <img title="Печать в Excel" src="https://public.kemsu.ru/icons/excel.jpg" style={{ cursor: 'pointer' }} onClick={handleDownloadXLSClick} />
                        </div>
                    </>
                )}
            </Loading>



        </React.Fragment >
    )
}


export const pageProps = {
    secure: true
}

export const layoutProps = {
    contentTitle: 'Отчет по итогам сессий',
    backUrl: 'http://xiais.kemsu.ru/dekanat/sess/index.htm'
}

export const funcLayoutProps = {
    topbarLinks
}