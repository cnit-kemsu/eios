import React, { useReducer, useEffect, useRef, useCallback } from 'react'
import {
    Select, Message, Button, Checkbox, useSelect
} from '@kemsu/eios-ui'
import $ from 'jquery'


import { DataRow } from 'share/eios/DataRow'
import { fetchApi, syncWithOldIais } from 'share/utils'
import Loading from 'share/eios/Loading'

import importPlan from './import'


const InfoRow = (props) => <DataRow {...props} style={{ padding: '4px 0px' }} titleStyle={{ width: '300px' }} />

export function Page({ setError }) {

    const [state, setState] = useReducer((prevState, newState) => ({ ...prevState, ...newState }), {
        specializations: [{ value: '', content: '- отсутствует -' }],
        planTypes: []
    })

    const specSelect = useSelect("")
    const { value: planType, ...planTypeSelect } = useSelect()

    const {
        invalidStandard,
        plan,
        planId,
        specializations,
        planTypes,
        message,
        messageType,
        importing,
        nextBtnClicked,
        needConfirmImport,
        forcedImport
    } = state

    useEffect(() => {
        (async () => {

            try {
                // Считываем выбранный в iais стандарт
                let planId = await syncWithOldIais('get-plan-standard')

                if (!planId) {
                    setState({ message: "Не выбран стандарт!", messageType: "error" })
                    return
                }

                // Проверяем, чтобы у всех блоков стандарта были указаны часы и зеты
                let response = await fetchApi(`dekanat/plans/check-plan/${planId}`, null, true, true)

                let invalidStandard = !(await response.json())

                if (invalidStandard) {
                    setState({ invalidStandard })
                    return
                }

                // Загружаем данные плана
                response = await fetchApi(`dekanat/plans/${planId}`, null, true, true)
                let plan = await response.json()

                // Загружаем список специализаций
                response = await fetchApi(`dekanat/specialities/${plan.SPECIALITY_ID}/specializations`, null, true, true)
                let specializations = await response.json()

                // Загружаем список видов плана
                response = await fetchApi(`dekanat/plans/types`)
                let planTypes = await response.json()

                setState({
                    planId: planId,
                    plan: plan,
                    specializations: [
                        { content: "- отсутствует -", value: "" },
                        ...specializations.map(s => ({
                            content: s.TITLE, value: s.ID
                        }))
                    ],
                    planTypes: planTypes.map(t => ({ value: t.ID, content: t.TITLE }))

                })

            } catch (err) {
                setError(err)
            }
        })()
    }, [setError])

    const fileRef = useRef()
    const startDateRef = useRef()
    const endDateRef = useRef()

    const clickNextBtn = useCallback(() => {

        if (!startDateRef.current.value || !endDateRef.current.value) {
            setState({
                message: "Не указан период обучения!",
                messageType: "warning"
            })
            return
        }

        setState({ nextBtnClicked: true, message: null })

    }, [])
    const toggleForcedImport = useCallback(() => setState({ forcedImport: !forcedImport }), [forcedImport])
    const clickImportPlanBtn = useCallback(() => {

        if (!startDateRef.current.value || !endDateRef.current.value) {
            setState({
                message: "Не указан период обучения!",
                messageType: "warning"
            })
            return
        }

        if (fileRef.current.files.length === 0) {
            setState({
                message: "Файл не выбран!",
                messageType: "warning"
            })
            return
        }

        if (fileRef.current.files.length > 1) {
            setState({
                message: "Выбрано несколько файлов! Необходимо выбрать один.",
                messageType: "warning"
            })
            return
        }

        // Парсим выбранный файл
        let reader = new FileReader()
        let xmlFile, type

        reader.onload = async e => {

            let xml = e.target.result

            try {
                xml = $($.parseXML(xml))
                if (!xml) throw new Error()
            } catch (err) {
                setState({ message: "Некорректный файл!", messageType: "error" })
                return;
            }

            // Импортируем план
            await importPlan({
                startDateRef, endDateRef,
                state: { ...state, specialization: specSelect.value, planType },
                setState
            }, xml, type)


            setState({ importing: false })
        }

        reader.onerror = () => {
            setState({ message: "Не удалось считать файл!", messageType: "error" })
        }

        xmlFile = fileRef.current.files[0]

        // Определяем формат выбранного файла
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

    }, [planType, specSelect.value, state])

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
                        <input style={{ minWidth: "200px", border: "1px solid #8a8a8a", height: "24px", padding: "2px" }} defaultValue="" ref={startDateRef} disabled={importing} type="date" />
                    </InfoRow>
                    <InfoRow title="Дата завершения обучения">
                        <input style={{ minWidth: "200px", border: "1px solid #8a8a8a", height: "24px", padding: "2px" }} defaultValue="" ref={endDateRef} disabled={importing} type="date" />
                    </InfoRow>
                    <InfoRow title="Вид учебного плана">
                        <Select value={planType || planTypes[1] ?.value} {...planTypeSelect} flat selectStyle={{ minWidth: "200px" }} disabled={importing} items={planTypes} />
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

            <br />

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

export const pageProps = {
    secure: true
}

export { default as Layout } from 'share/eios/layout/Layout'
