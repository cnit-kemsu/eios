import React from 'react'
import { Helmet } from 'react-helmet'

export default function HomePage() {

    return (
        <>
            <Helmet>
                <title>ЭИОС: Главная страница</title>
            </Helmet>
            <h1>Главная страница</h1>
            <p>Content</p>
        </>
    )
}


export const pageProps = {    
}

export const layoutProps = {
    //hideSidebar: true,
    subtitle: 'Личный кабинет',
    sidebarLinks: [
        { title: 'Деканат', url: '/dekanat' },
        { title: 'Пример', url: '/example' }
    ]
}