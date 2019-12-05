import React, { useReducer, useEffect, useRef, useCallback } from 'react'
import { css } from '@emotion/core'
import {
    Select, Message, Button, Checkbox, useSelect
} from '@kemsu/eios-ui'
import $ from 'jquery'

import { fetchApi, syncWithOldIais } from 'share/utils'
import Loading from 'share/eios/Loading'

import importPlan from './import'


const infoRowCss = css`
    display: flex;
    align-items: center;
    padding: 4px 0px;    
`

const InfoRow = ({ title, content, children }) => (
    <div css={infoRowCss}>
        <div style={{ fontWeight: 'bold', width: '300px' }}>{title}</div>
        <div>{content || children}</div>
    </div>
)

function convertDate(dateStr) {
    let date = new Date(dateStr)
    return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()}`
}

export function Page({ setError }) {

    const [state, setState] = useReducer((prevState, newState) => ({ ...prevState, ...newState }), {
        specializations: [{value: '', content: '- выберите -'}],
        planTypes: []
    })

    const specSelect = useSelect("")
    const { value, ...planTypeSelect } = useSelect()

    const {
        invalidStandard,
        plan,
        planId,
        specializations,
        planTypes,
        studyYears,
        message,
        messageType,

        specialization,
        planType,
        studyTerm,

        importing,

        nextBtnClicked,

        startDate,
        endDate,

        needConfirmImport,
        forcedImport
    } = state

    useEffect(() => {
        (async () => {

            try {
                let planId = await syncWithOldIais('get-plan-standard')

                if (!planId) {
                    setState({ message: "Не выбран стандарт!", messageType: "error" })
                    return
                }

                let response = await fetchApi(`dekanat/plans/check-plan/${planId}`, null, true, true)

                let invalidStandard = !(await response.json())

                if (invalidStandard) {
                    setState({ invalidStandard })
                    return
                }

                response = await fetchApi(`dekanat/plans/${planId}`, null, true, true)
                let plan = await response.json()

                response = await fetchApi(`dekanat/specialities/${plan.SPECIALITY_ID}/specializations`, null, true, true)
                let specializations = await response.json()

                response = await fetchApi(`dekanat/plans/types`)
                let planTypes = await response.json()

                response = await fetchApi(`dekanat/plans/study-years`)
                let studyYears = await response.json()

                setState({
                    planId: planId,
                    plan: plan,
                    specializations: [{ content: "- выберите -", value: "" }, ...specializations.map(s => ({
                        content: s.TITLE, value: s.ID
                    }))],
                    planTypes: planTypes.map(t => ({ value: t.ID, content: t.TITLE })),
                    studyYears: studyYears.map(sy => sy.YEARS),               
                    studyTerm: studyYears[0].YEARS
                })

            } catch (err) {
                setError(err)
            }
        })()
    }, [])

    const fileRef = useRef()
    const startDateRef = useRef()
    const endDateRef = useRef()

    const changeStartDate = useCallback(e => setState({ startDate: convertDate(e.target.value) }), [])
    const changeEndDate = useCallback(e => setState({ endDate: convertDate(e.target.value) }), [])
    const clickNextBtn = useCallback(() => setState({ nextBtnClicked: true }), [])
    const toggleForcedImport = useCallback(() => setState({ forcedImport: !forcedImport }), [])
    const clickImportPlanBtn = useCallback(() => {

        if (!startDateRef.current.value || !endDateRef.current.value) {
            setState({
                message: "Не указан период обучения!",
                messageType: "warning"
            })
            return
        }

        //let startDate = new Date(startDateRef.current.value)
        //let endDate = new Date(endDateRef.current.value)
        //let diff = endDate.getFullYear() - startDate.getFullYear()

        /*if (state.studyTerm < diff) {
            setState({
                message: "Сроки обучения меньше периода обучения!",
                messageType: "warning"
            })
            return
        }*/

        if (fileRef.current.files.length === 0) {
            setState({
                message: "Файл не выбран!",
                messageType: "warning"
            })
            return
        }

        let reader = new FileReader()
        let xmlFile, type

        reader.onload = async e => {

            let xml = e.target.result

            try {
                xml = $($.parseXML(xml))
                if (!xml) throw new Error()
            } catch (err) {
                console.error(err)
                setState({ message: "Некорректный файл!", messageType: "error" })
                return;
            }

            await importPlan({
                state,
                setState
            }, xml, type)


            setState({ importing: false })
        }

        reader.onerror = function (event) {
            console.error(event)
            setState({ message: "Не удалось считать файл!", messageType: "error" })
        }

        xmlFile = fileRef.current.files[0]

        if (xmlFile.name.toLowerCase().endsWith('.xml')) {
            type = 'xml'
        } else if (xmlFile.name.toLowerCase().endsWith('.plx')) {
            type = 'plx'
        } else if (xmlFile.name.toLowerCase().endsWith('.osf')) {
            type = 'osf'
        } else {
            setState({ message: "Выбран файл с неизвестным расширением!", messageType: "error" })
            return
        }

        setState({ message: null, messageType: null, importing: true, needConfirmImport: false })

        reader.readAsText(xmlFile)
    }, [state])

    if (invalidStandard) {
        return (
            <div>
                <Message type='error'>
                    Не для всех блоков выбранного стандарта указаны часы или ЗЕТы!
                </Message>
            </div>
        )
    } 

    return (
        <div>
            {
                plan
                &&
                <>
                    <InfoRow title="Идентификатор стандарта учебного плана" content={planId} />
                    <InfoRow title="Факультет" content={plan.FACULTY} />
                    <InfoRow title="Специальность/Направление" content={plan.SPECIALITY} />
                    <InfoRow title="Квалификация" content={plan.QUALIFICATION} />
                    <InfoRow title="Форма обучения" content={plan.FORM_LEARN} />

                    <br />

                    <InfoRow title="Специализация/профиль">
                        <Select {...specSelect} flat selectStyle={{ minWidth: "200px" }} disabled={importing} items={specializations} />
                    </InfoRow>
                    <InfoRow title="Дата начала обучения">
                        <input style={{ minWidth: "200px", border: "1px solid #8a8a8a", height: "24px", padding: "2px" }} defaultValue="" onChange={changeStartDate} ref={startDateRef} disabled={importing} type="date" />
                    </InfoRow>
                    <InfoRow title="Дата завершения обучения">
                        <input style={{ minWidth: "200px", border: "1px solid #8a8a8a", height: "24px", padding: "2px" }} defaultValue="" onChange={changeEndDate} ref={endDateRef} disabled={importing} type="date" />
                    </InfoRow>
                    <InfoRow title="Вид учебного плана">
                        <Select value={value || planTypes[1] ?.value} {...planTypeSelect} flat selectStyle={{ minWidth: "200px" }} disabled={importing} items={planTypes} />
                    </InfoRow>

                    <br />

                    {!nextBtnClicked && <Button colorStyle="secondary" onClick={clickNextBtn}>Продолжить</Button>}

                    {
                        nextBtnClicked
                        &&
                        <>
                            <InfoRow title="План в формате XML, PLX или OSF">
                                <input ref={fileRef} disabled={importing} type="file" />
                            </InfoRow>
                            <br />
                            <Button disabled={importing} colorStyle='secondary' onClick={clickImportPlanBtn}>Импортировать</Button>
                            <br />
                        </>
                    }
                </>
            }

            <Loading loading={importing} title="Выполняется импортирование плана..." />

            {
                message
                &&
                <Message type={messageType}>
                    {message}
                </Message>
            }

            {
                needConfirmImport && (
                    <Checkbox checked={forcedImport} onChange={toggleForcedImport}>Импортировать план с вещественными значениями часов/ЗЕТов (нужно будет снова нажать кнопку "Импортировать")</Checkbox>
                )
            }

        </div>
    )
}

export { default as Layout } from 'share/eios/layout/Layout'
