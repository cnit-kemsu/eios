import React, { useState, useEffect, useCallback } from 'react'

import { Select, Table, useSelect } from '@kemsu/eios-ui'
import { fetchApi } from 'share/utils'
import { studentPages } from 'share/eios/studentPages'
import { topbarLinks } from './links'
import Loading from 'share/eios/Loading'


function convertDisciplines(disciplines) {

    let converted = []

    for (const disc of disciplines) {

        const { type, children, ...rest } = disc

        converted.push({ ...rest, type })

        if (type == 2 && children instanceof Array) {
            converted = converted.concat(children.map(child => ({ ...child, margin: true })))
        }
    }

    return converted
}

function getSemNum(semester) {
    return +semester.split("_")[0]
}


export function Page() {

    const [studyCards, setStudyCards] = useState([])
    const [loadingStudyCards, setLoadingStudyCards] = useState(false)

    const onChangeStudyCard = useCallback((value) => {        

        setDisciplines([])        
        setSemesters([])        

        value && fetchSemesters(value)

    }, [fetchSemesters])

    const studyCardSelect = useSelect("", onChangeStudyCard)

    const [semesters, setSemesters] = useState([])
    const [loadingSemesters, setLoadingSemesters] = useState(false)

    const onChangeSemester = useCallback((value) => {        

        setDisciplines([])        

        value && fetchDisciplines(getSemNum(value))

    }, [fetchDisciplines])

    const semesterSelect = useSelect("", onChangeSemester)

    const [disciplines, setDisciplines] = useState([])
    const [loadingDisciplines, setLoadingDisciplines] = useState(false)  
    

    async function fetchStudyCards() {
        try {

            setLoadingStudyCards(true)
            const r = await fetchApi('dekanat/students/study-cards', null, true, true)
            setStudyCards(await r.json())

        } catch (err) {
            console.error(err)
        } finally {
            setLoadingStudyCards(false)
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function fetchSemesters(value) {

        try {

            setLoadingSemesters(true)

            const r = await fetchApi('personal-office/main/getSemesterList', {
                method: 'post',
                body: JSON.stringify({
                    studentId: value
                })
            }, true, true)

            setSemesters((await r.json()).semesterList)

        } catch (err) {
            console.error(err)
        } finally {
            setLoadingSemesters(false)
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function fetchDisciplines(semester) {

        try {


            setLoadingDisciplines(true)

            let sem

            for (let s of semesters) {
                if (s.semester === semester) {
                    sem = s
                    break
                }
            }

            const r = await fetchApi('personal-office/main/getDisciplineList', {
                method: 'post',
                body: JSON.stringify({
                    course: sem.course,
                    semester: sem.semester,
                    planId: sem.planId,
                    studentId: studyCardSelect.value
                })
            }, true, true)

            setDisciplines((await r.json()).disciplineList)

        } catch (err) {
            console.error(err)
        } finally {
            setLoadingDisciplines(false)
        }
    }

    useEffect(() => {
        fetchStudyCards()
    }, [])    

    return (
        <>
            <Loading loading={loadingStudyCards}>
                <h3>Учебная карта:</h3>
                <Select selectStyle={{ minWidth: "200px" }} {...studyCardSelect}
                    items={[{ content: "- Выберите учебную карту -", value: "" }, ...studyCards.map(({ ID, FACULTY, SPECIALITY, STATUS_STR }) => ({ content: `${FACULTY} / ${SPECIALITY} /  ${STATUS_STR}`, value: ID }))]} />
            </Loading>

            <br /> <br />

            <Loading loading={loadingSemesters}>
                {studyCardSelect.value && (
                    <>
                        <h3>Семестр:</h3>
                        <Select selectStyle={{ minWidth: "200px" }} {...semesterSelect}
                            items={[{ content: "- Выберите семестр -", value: "" }, ...semesters.map(({ semester, course, semesterStr }) => ({ content: `${semesterStr} (${course} курс)`, value: `${semester}_${course}` }))]}/>
                    </>
                )}
            </Loading>

            <br /> <br />

            <Loading loading={loadingDisciplines}>
                {semesterSelect.value && (

                    <Table>
                        <thead>
                            <tr>
                                <td>Название дисциплины</td>
                                <td>Формы промежуточной аттестации</td>
                                <td>ЗЕТ</td>
                                <td>Количество часов</td>
                                <td>Курс</td>
                                <td>Семестр</td>
                                <td>Рабочая программа</td>
                            </tr>
                        </thead>
                        <tbody>
                            {convertDisciplines(disciplines).map(({ discipineName, reportList, zet, hours, course, semesterStr, workProgramId, type, margin }, i) => (<tr key={i}>
                                <td style={{ fontWeight: type == 2 ? 'bold' : 'normal', paddingLeft: margin ? '3em' : undefined }}>{discipineName}</td>
                                <td>{reportList}</td>
                                <td>{zet}</td>
                                <td>{hours}</td>
                                <td>{course}</td>
                                <td>{semesterStr}</td>
                                <td>{workProgramId && <a href={`https://api-next.kemsu.ru/api/work-prog2/${workProgramId}?pdf=true`}><img title={`Скачать рабочую программу дисциплины "${discipineName}" в PDF`} style={{ width: '36px' }} src="http://public.kemsu.ru/icons/pdf.png" /></a>}</td>
                            </tr>))}
                        </tbody>
                    </Table>
                )}
            </Loading>           

        </>
    )
}

export const pageProps = {
    secure: true
}

export { default as Layout } from 'share/eios/layout/Layout'

export const layoutProps = {
    topbarLinks,
    sidebarLinks: studentPages('plans'),
    cnitContacts: {
        phone: '(384-2) 58-32-89',
        localPhone: '4-62',
        email: 'ocpo@kemsu.ru'
    }
}

