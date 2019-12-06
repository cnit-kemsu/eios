import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Pane, Table, Message } from '@kemsu/eios-ui'

import { getFacultyInfo, getUrlForOldIais, fetchDevApi as fetchApi } from 'share/utils'
import Loading from 'share/eios/Loading'

import { statisticItemCss, statisticsContainerCss, remindersCss } from './style'


const StatisticItem = (({ title, value }) => (
    <div css={statisticItemCss}>
        <div>{title}</div>
        <div>{value}</div>
    </div>
))


export function Page({ setError }) {

    const facultyInfo = getFacultyInfo()

    const title = facultyInfo ?.isFaculty ? 'Факультет' : 'Институт'

    const [statistics, setStatistics] = useState([])
    const [reminders, setReminders] = useState([])

    const [loadingReminders, setLoadingReminder] = useState(true)

    useEffect(() => {        

        const facultyInfo = getFacultyInfo();

        (async () => {

            if(!facultyInfo) return

            const { id } = facultyInfo

            try {

                let result = await fetchApi(`dekanat/faculties/${id}/statistics`)
                setStatistics(await result.json())

                result = await fetchApi(`dekanat/faculties/${id}/reminders`)
                setReminders(await result.json())
                setLoadingReminder(false)
            } catch (err) {
                setError(err)
            }

        })()
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!facultyInfo) {
        return <Message type="warning">Не выбран институт/факультет!</Message>
    }

    return (
        <>
            <Helmet>
                <title>ЭИОС: {title}</title>
            </Helmet>
            <h1>{title}</h1>
            <div style={{ marginBottom: '21px' }}>
                <h3>Статистика</h3>
                <div css={statisticsContainerCss}>
                    <Pane title='Контингент' style={{ marginRight: '20px' }}>
                        <StatisticItem title='Абитуриентов' value={statistics.ABIT_CNT} />
                        <StatisticItem title='Всего студентов' value={statistics.STUD_CNT} />
                        <StatisticItem title='Учится' value={statistics.LEARN_CNT} />
                        <StatisticItem title='В академическом отпуске' value={statistics.ACAD_CNT} />
                        <StatisticItem title='Не связаны с учебным планом' value={statistics.NO_PLAN} />
                    </Pane>

                    <Pane title='Элементы учебного процесса'>
                        <StatisticItem title='Стандартов специальности/направления' value={statistics.STD_CNT} />
                        <StatisticItem title='Учебных планов' value={statistics.WORK_CNT} />
                        <StatisticItem title='Всего сессий' value={statistics.ALL_SESS_CNT} />
                        <StatisticItem title='Открытых сессий' value={statistics.SESS_CNT} />
                    </Pane>
                </div>
            </div>
            <div css={remindersCss}>
                <Loading loading={loadingReminders} title="Загрузка списка напоминаний..." titleWidth="200px">
                    <div style={{ width: '70%' }}>

                        <h3>Напоминания</h3>

                        <Table>
                            <thead>
                                <tr>
                                    <td>Сообщение</td>
                                    <td>Дата</td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    reminders.map((reminder, i) => (
                                        <tr key={i}>
                                            <td>{reminder.COMMENTZ}</td>
                                            <td>{reminder.DATA}</td>
                                            <td>
                                                <a href={`https://niais2.kemsu.ru/dekanat/${reminder.HREF}?student_id=${reminder.STUDENT_ID}&in_gl_operation_id=${reminder.ID}&person_id=${reminder.PERSON_ID}`}>
                                                    {reminder.TITLE}
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    </div>
                </Loading>
            </div>
        </>
    )
}

export const pageProps = {
    secure: () => {

        const facultyInfo = getFacultyInfo()


        return {
            object: 'iais:dekanat',
            restriction: { name: "facultyId", value: facultyInfo ?.id },
            errorMessage: `У вас нет доступа к выбранному институту/факультету (${facultyInfo.name})!`
        }
    }
}

export const layoutProps = {
    sidebarLinks: [
        { ext: true, title: 'Учебные планы', url: getUrlForOldIais('dekanat/plan_fgos2/index.htm') },
        { ext: true, title: 'Учебные планы ФГОС3', url: getUrlForOldIais('dekanat/plan/index.htm') },
        { ext: true, title: 'Личные карты', url: getUrlForOldIais('dekanat/pers_card/index.htm') },
        { ext: true, title: 'Учебные карты', url: getUrlForOldIais('dekanat/learn/index.htm') },
        { ext: true, title: 'Сессия', url: getUrlForOldIais('dekanat/sess/index.htm') },
        { ext: true, title: 'Отчеты', url: getUrlForOldIais('dekanat/otch/index.htm') },
        { ext: true, title: 'Операции', url: getUrlForOldIais('dekanat/oper/index.htm') },
        { ext: true, title: 'Группы', url: getUrlForOldIais('dekanat/group/index.htm') },
        { ext: true, title: 'Итоговая аттестация', url: getUrlForOldIais('dekanat/5/index.htm') },
        { title: "Импорт плана", url: "/dekanat/faculty/import-plan" }
    ]
}