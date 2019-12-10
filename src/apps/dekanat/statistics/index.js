import React, { useState, useEffect } from 'react'
import { Table } from '@kemsu/eios-ui'

import { fetchApi } from 'share/utils'
import Loading from 'share/eios/Loading'

import { topbarLinks } from './links'

export default function StatisticsPage() {

    const [statistics, setStatistics] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        (async () => {
            const result = await fetchApi('dekanat/faculties/statistics')
            setStatistics(await result.json())
            setLoading(false)
        })()

    }, [setStatistics, setLoading])

    return (
        <>            
            <Loading loading={loading} title='Загрузка статистики...'>
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
                            statistics.map(({ TITLE, STUD_CNT, STD_CNT, ABIT_CNT, WORK_CNT, SESS_CNT, PERS_CNT }, i) => (
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