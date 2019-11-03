import React from 'react'
import { Helmet } from 'react-helmet'
import { topbarLinks } from '../links'

export default function DekanatPage() {    

    return (
        <>
            <Helmet>
                <title>ЭИОС: Деканат</title>
            </Helmet>
            <h1>Деканат</h1>
        </>
    )
}

export const layoutProps = {
    sidebarLinks: [
        { title: 'Статистика', url: '/dekanat/statistics' }
    ],
    topbarLinks
}