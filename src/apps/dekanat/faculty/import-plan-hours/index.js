import React, { useState, useCallback, useReducer, useRef }  from 'react'
import { topbarLinks } from './links'
import $ from 'jquery'

import {
    Message, Button
} from '@kemsu/eios-ui'

import Loading from 'share/eios/Loading'
import { DataRow } from 'share/eios/DataRow'

import { fetchApi, syncWithOldIais } from 'share/utils'

import * as xmlGen from '../import-plan/xml'
import * as plxGen from '../import-plan/plx'
import * as osfGen from '../import-plan/osf'



const InfoRow = (props) => <DataRow {...props} style={{ padding: '4px 0px' }} titleStyle={{ width: '300px' }} />


export function Page() {

    const [state, setState] = useReducer((prevState, newState) => ({ ...prevState, ...newState }), {})

        const [importing, setImporting] = useState(false)
        const fileRef = useRef()


        const importHours = useCallback(async () => {

            if (fileRef.current.files.length === 0) {
                setState({
                    message: "Файл не выбран!",
                    messageType: "warning"
                })
                return
            }

            setImporting(true)
            setState({ message: '' })

            const planId = await syncWithOldIais('get-plan', 'xiais')

            let response = await fetchApi(`dekanat/plans/${planId}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                setState({ message: response.statusText, messageType: 'error' })
                return
            }

            const plan = await response.json()

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

                let gen

                if (type === 'xml') gen = xmlGen
                else if (type === 'plx') gen = plxGen
                else if (type === 'osf') gen = osfGen

                let self = {}

                let planInfo = gen.getPlanInfo(self, xml)

                if (planInfo.learnForm.toLowerCase() !== plan.FORM_LEARN.toLowerCase()) {
                    setState({
                        message: `Форма обучения в плане (${planInfo.learnForm}) не совпадает с формой обучения в стандарте (${plan.FORM_LEARN})!`,
                        messageType: "error"
                    })
                    return
                }


                if (+planInfo.years > +plan.STUDY_TERM.replace(',', '.')) {
                    setState({
                        message: `Срок обучения в плане (${planInfo.years}) превышает срок обучения в стандарте (${plan.STUDY_TERM})!`,
                        messageType: "error"
                    })
                    return
                }


                let planRows = gen.getPlanRowsFrom(self, xml)
                let teachingPractices = gen.getPracticesFrom(self, xml, "У")
                let prodPractices = gen.getPracticesFrom(self, xml, "П")
                let searchingPractices = gen.getPracticesFrom(self, xml, "Н")
                let undergradPractices = gen.getPracticesFrom(self, xml, "Пд")
                let simPractices = gen.getPracticesFrom(self, xml, "С")
                let prepVKRPractices = gen.getPracticesFrom(self, xml, "Д")
                let prepGIAPractices = gen.getPracticesFrom(self, xml, "Г")

                // для каждой строки плана обходим дочерние элементы (если они есть)
                for (const planRow of planRows) {
                    for (const childPlanRow of planRows) {
                        if (planRow.code !== childPlanRow.code /*&& childCode.startsWith(planRow.code)*/) {



                            let childCodeParts = childPlanRow.code.split('.')
                            let planRowCodeParts = planRow.code.split('.')

                            let flag = true;

                            // является ли элемент дочерним
                            for (let i = 0; i < planRowCodeParts.length; ++i) {
                                if (planRowCodeParts[i] !== childCodeParts[i]) {
                                    flag = false;
                                    break;
                                }
                            }

                            // если дочерний
                            if (flag) {

                                if (planRow.discTypeId === 780) {
                                    childPlanRow.discTypeId = 206
                                } else {
                                    planRow.discTypeId = 7540 // родитель становится модулем
                                }

                                // для физ.культуры убираем семестры, так как они проставляются вручную
                                if (childPlanRow.physCulture) {

                                    childPlanRow.noconnSemesters = childPlanRow.semesters.length > 0 ? childPlanRow.semesters : planRow.semesters
                                    childPlanRow.semesters = []
                                }
                            }
                        }
                    }
                }                

                const requestData = [
                    ...planRows, ...teachingPractices, ...prodPractices, ...searchingPractices,
                    ...undergradPractices, ...simPractices, ...prepGIAPractices, ...prepVKRPractices
                ].filter(planRow => planRow.discTypeId == 206 || planRow.discTypeId == 780).map(({ name, semesters, noconnSemesters }) => ({ name, semesters, noconnSemesters }))
         

                response = await fetchApi(`dekanat/plans/importer/${planId}/import-hours`, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: 'post',
                    body: JSON.stringify(requestData)

                })
                

                if (!response.ok) {                    
                    setState({ message: (await response.json()).error, messageType: 'error' })
                    setImporting(false)
                    return
                }

                const errors = await response.json()

                if (errors.length > 0) {
                    setState({ message: errors.map((err, i) => <React.Fragment key={i}>{err}<br /></React.Fragment>), messageType: 'warning' })
                        
                }

                setImporting(false)

                if(errors.length === 0)
                    location = "http://xiais.kemsu.ru/dekanat/plan/work/semester/index.htm"
            }

            reader.onerror = function () {
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

            reader.readAsText(xmlFile)

        }, [])        

        return (
            <div>
                <InfoRow title="План в формате XML, PLX или OSF" content={<input ref={fileRef} disabled={importing} type="file" />} />
                <br />
                <Button disabled={importing} colorStyle='secondary' onClick={importHours}>Импортировать</Button>
                <br />

                <Loading loading={importing} title="Выполняется импортирование часов из плана...">
                {
                    state.message
                    &&
                    <Message type={state.messageType}>
                        {state.message}
                    </Message>
                }
                </Loading>

            </div>
        )
}



export const pageProps = {
    secure: true    
}

export const layoutProps = {
    contentTitle: 'Импорт часов',
    backUrl: 'http://xiais.kemsu.ru/dekanat/plan/work/semester/index.htm'
}

export const funcLayoutProps = {
    topbarLinks
}