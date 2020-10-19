import React from 'react'
import LinkList from 'share/eios/LinkList'

import { topbarLinks } from './links'


export function Page(){
    return (
        <>
            <div>
                <LinkList links={[
                    /*{ target: '_blank', ext: true, title: '05.03.02 География', url: 'http://umu.kemsu.ru/pages/FGOSm_050302' },
                    { target: '_blank', ext: true, title: '35.03.10 Ландшафтная архитектура', url: 'http://umu.kemsu.ru/pages/FGOSm_350310' },
                    { target: '_blank', ext: true, title: '05.04.01 Геология', url: 'http://umu.kemsu.ru/pages/FGOSm_050401' },
                    { target: '_blank', ext: true, title: '49.04.03 Спорт', url: 'http://umu.kemsu.ru/pages/FGOSm_490403' },
                    { target: '_blank', ext: true, title: '36.05.01 Ветеринария', url: 'http://umu.kemsu.ru/pages/FGOSVO_360501' },
                    { target: '_blank', ext: true, title: '33.05.01 Фармация', url: 'http://umu.kemsu.ru/pages/FGOSm_330501_' }*/
                ]} />
            </div>
        </>
    )
}

export const pageProps = {
    ignoreNotChangedPassword: true
}

export const layoutProps = {
    contentTitle: 'Пакет документов для лицензирования',    
    backUrl: '/home/personal-area'
}

export const funcLayoutProps = {    
    topbarLinks
}


export { default as Layout } from 'share/eios/layout/Layout'