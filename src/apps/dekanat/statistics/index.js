import React, { useEffect } from 'react'
import { Table } from '@kemsu/eios-ui'

import { fetchApi } from 'share/utils'
import Loading from 'share/eios/Loading'
import { useAsync } from 'share/hooks'

import { topbarLinks } from './links'

export default function StatisticsPage({ setError }) {

    const statistics = useAsync(async () => {
        const result = await fetchApi('dekanat/faculties/statistics')
        return result.json()
    }, [], [])

    useEffect(() => {
        setError(statistics.error)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statistics.error])

    return (
        <>
            <Loading delay={1} loading={statistics.loading} title='Загрузка статистики...'>
                <Table>
                    <thead>
                        <tr>
                            <td>Институт/Факультет</td>
                            <td>Личных дел</td>
                            <td>Абитуриентов</td>
                            <td>Студентов</td>
                            <td>Стандартов специальности / направления</td>
                            <td>Учебных планов</td>
                            <td>Сессий</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            statistics.value.map(({ TITLE, STUD_CNT, STD_CNT, ABIT_CNT, WORK_CNT, SESS_CNT, PERS_CNT }, i) => (
                                <tr key={i}>
                                    <td>{TITLE}</td>
                                    <td>{PERS_CNT}</td>
                                    <td>{ABIT_CNT}</td>
                                    <td>{STUD_CNT}</td>
                                    <td>{STD_CNT}</td>
                                    <td>{WORK_CNT}</td>
                                    <td>{SESS_CNT}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </Loading>
        </>
    )
}

export const layoutProps = {
    sidebarLinks: [],
    topbarLinks,
    contentTitle: 'Статистика'
}