import React from 'react'


import { makeAppGenerator, logout, getUserFullName } from 'share/utils'
import LinkList from 'share/eios/LinkList'

import { topbarLinks } from './links'

export const appGenerator = makeAppGenerator(() => {
    return (
        <>
            <div>
                <LinkList links={[
                    { target: '_blank', ext: true, title: '05.03.02 География', url: 'http://umu.kemsu.ru/pages/FGOSm_050302' },
                    { target: '_blank', ext: true, title: '35.03.10 Ландшафтная архитектура', url: 'http://umu.kemsu.ru/pages/FGOSm_350310' },
                    { target: '_blank', ext: true, title: '05.04.01 Геология', url: 'http://umu.kemsu.ru/pages/FGOSm_050401' },
                    { target: '_blank', ext: true, title: '49.04.03 Спорт', url: 'http://umu.kemsu.ru/pages/FGOSm_490403' },
                    { target: '_blank', ext: true, title: '36.05.01 Ветеринария', url: 'http://umu.kemsu.ru/pages/FGOSVO_360501' },
                    { target: '_blank', ext: true, title: '33.05.01 Фармация', url: 'http://umu.kemsu.ru/pages/FGOSm_330501_' }
                ]} />
            </div>
        </>
    )
}, { ignoreNotChangedPassword: true })


export const layoutProps = {
    contentTitle: 'Лицензированные новые специальности и направления подготовки',
    onLogoutButtonClick: logout,
    backUrl: '/personal-area'
}

export const funcLayoutProps = {
    username: getUserFullName,
    topbarLinks
}


export { default as Layout } from 'share/eios/layout/Layout'