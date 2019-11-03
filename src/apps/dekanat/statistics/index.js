import React from 'react'
import { Helmet } from 'react-helmet'
import { topbarLinks } from './links'

export default function StatisticsPage() {

    return (
        <>
            <Helmet>
                <title>ЭИОС: Главная страница</title>
            </Helmet>
            <h1>Статистика</h1>
        </>
    )
}

export const layoutProps = {
    sidebarLinks: [],
    topbarLinks
}