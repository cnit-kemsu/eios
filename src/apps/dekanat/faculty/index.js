import React, { useEffect } from 'react'
import { Pane, Table, Message } from '@kemsu/eios-ui'

import { getFacultyInfo, getUrlForOldIais, fetchDevApi as fetchApi } from 'share/utils'
import { useAsync } from 'share/hooks'
import Loading from 'share/eios/Loading'

import { statisticItemCss, statisticsContainerCss, remindersCss } from './style'
import { topbarLinks } from './links'


const StatisticItem = (({ title, value }) => (
    <div css={statisticItemCss}>
        <div>{title}</div>
        <div>{value}</div>
    </div>
))


async function fetchStatistics() {
    const r = await fetchApi(`dekanat/faculties/${getFacultyInfo() ?.id}/statistics`)
    return r.json()
}

async function fetchReminders() {
    const r = await fetchApi(`dekanat/faculties/${getFacultyInfo() ?.id}/reminders`)
    return r.json()
}


export function Page({ setError }) {

    const facultyInfo = getFacultyInfo()    

    // eslint-disable-next-line no-unused-vars
    const statistics = useAsync(fetchStatistics, {}, [])
    const reminders = useAsync(fetchReminders, [], [])

    useEffect(() => {
        const error = statistics.error || reminders.error
        setError(error)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statistics.error, reminders.error])
    

    if (!facultyInfo) {
        return <Message type="warning">Не выбран институт/факультет!</Message>
    }

    return (
        <>
            <div style={{ marginBottom: '21px' }}>
                <h3>Статистика</h3>
                <div css={statisticsContainerCss}>
                    <Pane title='Контингент' style={{ marginRight: '20px' }}>
                        <StatisticItem title='Абитуриентов' value={statistics.value.ABIT_CNT} />
                        <StatisticItem title='Всего студентов' value={statistics.value.STUD_CNT} />
                        <StatisticItem title='Учится' value={statistics.value.LEARN_CNT} />
                        <StatisticItem title='В академическом отпуске' value={statistics.value.ACAD_CNT} />
                        <StatisticItem title='Не связаны с учебным планом' value={statistics.value.NO_PLAN} />
                    </Pane>

                    <Pane title='Элементы учебного процесса'>
                        <StatisticItem title='Стандартов специальности/направления' value={statistics.value.STD_CNT} />
                        <StatisticItem title='Учебных планов' value={statistics.value.WORK_CNT} />
                        <StatisticItem title='Всего сессий' value={statistics.value.ALL_SESS_CNT} />
                        <StatisticItem title='Открытых сессий' value={statistics.value.SESS_CNT} />
                    </Pane>
                </div>
            </div>
            <div css={remindersCss}>
                <Loading delay={1} loading={reminders.loading} title="Загрузка списка напоминаний..." titleWidth="200px">
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
                                    reminders.value.map((reminder, i) => (
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
        //{ title: "Импорт плана", url: "/dekanat/faculty/import-plan" }
    ]
}

export const funcLayoutProps = {
    topbarLinks,
    contentTitle: () => getFacultyInfo() ?.isFaculty ? 'Факультет' : 'Институт'
}