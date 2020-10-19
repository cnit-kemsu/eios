import React, { useState, useEffect, useCallback } from 'react'

import { Select, Table, useSelect } from '@kemsu/eios-ui'
import { fetchApi } from 'share/utils'
import { studentPages } from 'share/eios/studentPages'
import { topbarLinks } from './links'
import Loading from 'share/eios/Loading'



export function Page() {

    const [studyCards, setStudyCards] = useState([])
    const [loadingStudyCards, setLoadingStudyCards] = useState(false)

    const onChangeStudyCard = useCallback((value) => {

        setScientificReitList([])
        setBrsSemesterList([])
        setPortfolio([])

        console.log("setPortfolio")
        value && fetchPortfolio(value)

    }, [fetchPortfolio])

    const studyCardSelect = useSelect("", onChangeStudyCard)

    const [portfolio, setPortfolio] = useState([])
    const [loadingPortfolio, setLoadingPortfolio] = useState(false)

    const [brsSemseterList, setBrsSemesterList] = useState([])
    const [loadingBrsSemesterList, setLoadingBrsSemesterList] = useState(false)

    const [scientificReitList, setScientificReitList] = useState([])
    const [loadingScientificReitList, setLoadingScientificReitList] = useState(false)   
    
    const onShowBrsSemesterList = useCallback(async () => {
        try {

            setLoadingBrsSemesterList(true)
            setScientificReitList([])

            const r = await fetchApi('personal-office/main/getBrsSemesterList ', {
                method: 'post',
                body: JSON.stringify({
                    studentId: studyCardSelect.value
                })
            }, true, true)

            setBrsSemesterList((await r.json()).brsSemesterList)

        } catch (err) {
            console.error(err)
        } finally {
            setLoadingBrsSemesterList(false)
        }
    }, [studyCardSelect.value])

    const onShowScientificReitList = useCallback(async () => {
        try {

            setLoadingScientificReitList(true)
            setBrsSemesterList([])

            const r = await fetchApi('personal-office/main/getScientificReitList ', {
                method: 'post',
                body: JSON.stringify({
                    studentId: studyCardSelect.value
                })
            }, true, true)

            setScientificReitList((await r.json()).scientificReitList)

        } catch (err) {
            console.error(err)
        } finally {
            setLoadingScientificReitList(false)
        }
    }, [studyCardSelect.value])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function fetchPortfolio(value) {

        try {

            setLoadingPortfolio(true)

            const r = await fetchApi('personal-office/main/getStudentInfo', {
                method: 'post',
                body: JSON.stringify({
                    studentId: value
                })
            }, true, true)

            const studInfo = (await r.json()).studentInfo
            console.log(studInfo)

            setPortfolio(studInfo)

        } catch (err) {
            console.error(err)
        } finally {
            setLoadingPortfolio(false)
        }
    }

    async function fetchStudyCards() {
        try {

            setLoadingStudyCards(true)
            const r = await fetchApi('dekanat/students/study-cards', null, true, true)
            const studyCards = await r.json()
            setStudyCards(studyCards)

        } catch (err) {
            console.error(err)
        } finally {
            setLoadingStudyCards(false)
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
                    items={[{ content: "- Выберите учебную карту -", value: "" }, ...studyCards.map(({ ID, FACULTY, SPECIALITY, STATUS_STR }) => ({ content: `${FACULTY} / ${SPECIALITY} /  ${STATUS_STR}`, value: ID }))]}
                />
            </Loading>

            <br /> <br />

            <Loading loading={loadingPortfolio}>

                {portfolio.length > 0 &&
                    <Table>
                        <thead>
                            <tr>
                                <td style={{ width: "10%" }} colSpan={2}>Кол-во БСОД (дисциплин)</td>
                                <td style={{ width: "10%" }} colSpan={2}>Кол-во достижений по внеучебной деятельности</td>
                                <td>ВКР (выпускная квалификационная работа)</td>
                            </tr>
                        </thead>
                        <tbody>
                            {portfolio.map(({ BSOD_CNT, NO_STUDY_CNT, VKR_NAME, VKR_FILE_NAME }, i) => (
                                <tr key={i}>
                                    <td>{BSOD_CNT}</td>
                                    <td align="center" ><img style={{ cursor: 'pointer' }} onClick={onShowBrsSemesterList} title='просмотр информации по учебному рейтингу' src="http://public.kemsu.ru/icons/zoom.png"></img></td>
                                    <td>{NO_STUDY_CNT}</td>
                                    <td align="center" ><img style={{ cursor: 'pointer' }} onClick={onShowScientificReitList} title='просмотр информации по учебному рейтингу' src="http://public.kemsu.ru/icons/zoom.png"></img></td>
                                    <td>{VKR_FILE_NAME && (<a href={`http://edu.kemsu.ru/res/load_docs/?name=${VKR_FILE_NAME}&url=/docs/vkr/${VKR_FILE_NAME}`}>{VKR_NAME}</a>)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>}

            </Loading>

            <br /><br />

            <Loading loading={loadingBrsSemesterList}>
                {brsSemseterList.length > 0 &&
                    <Table>
                        <thead>
                            <tr>
                                <td>Учебный год</td>
                                <td>Семестр</td>
                                <td>Учебный рейтинг за семестр</td>
                            </tr>
                        </thead>
                        <tbody>
                            {brsSemseterList.map(({ SEMESTER, STUD_YEAR_START, STUD_YEAR_END, COMMON_BALL_FOR_SEMESTER }, i) => (
                                <tr key={i}>
                                    <td>{STUD_YEAR_START}-{STUD_YEAR_END}</td>
                                    <td>{SEMESTER}</td>
                                    <td>{COMMON_BALL_FOR_SEMESTER}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>}
            </Loading>

            <Loading loading={loadingScientificReitList}>

                {scientificReitList.length > 0 &&
                    <Table>
                        <thead>
                            <tr>
                                <td rowSpan={2}>Учебный год</td>
                                <td rowSpan={2}>Сем</td>
                                <td>Научно-исследовательский рейтинг</td>
                                <td>Спортивный рейтинг</td>
                                <td>Культурно-творческий рейтинг</td>
                                <td>Общественный рейтинг</td>
                                <td rowSpan={2}>Общая сумма баллов</td>
                            </tr>
                            <tr>
                                <td>Сумма баллов</td>
                                <td>Сумма баллов</td>
                                <td>Сумма баллов</td>
                                <td>Сумма баллов</td>
                            </tr>
                        </thead>
                        <tbody>
                            {scientificReitList.map(({ SEM, STUD_YEAR_START, STUD_YEAR_END, SR_REIT_SUM, SPORT_REIT_SUM, CA_REIT_SUM, SOC_REIT_SUM, SUM_BALL }, i) => (
                                <tr key={i}>
                                    <td>{STUD_YEAR_START}-{STUD_YEAR_END}</td>
                                    <td>{SEM}</td>
                                    <td>{SR_REIT_SUM}</td>
                                    <td>{SPORT_REIT_SUM}</td>
                                    <td>{CA_REIT_SUM}</td>
                                    <td>{SOC_REIT_SUM}</td>
                                    <td>{SUM_BALL}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>}
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
    sidebarLinks: studentPages('portfolio'),
    cnitContacts: {
        phone: '(384-2) 58-32-89',
        localPhone: '4-62',
        email: 'ocpo@kemsu.ru'
    }
}