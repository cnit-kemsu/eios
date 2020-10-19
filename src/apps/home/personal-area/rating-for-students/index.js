import React from 'react'
import { css } from '@emotion/core'

import { getUrlForOldIais } from 'share/utils'


const hrefCss = css`
    
    display: inline-block;
    padding: 6px;
    padding-left: 0px;    
    text-decoration: none;
    color: #575d6d;    
    transition: color 0.5s;
    cursor: pointer;
    font-size: 16px;

    &:hover {
        text-decoration: underline;
    }
`

export function Page() {

    return (
        <>
            <h1>Рейтинг обучающегося</h1>
            <span style={{ marginRight: '12px' }}>•</span>
            <a css={hrefCss} href={getUrlForOldIais('dekanat/uspev/reit/student/forStudent.doc')}>Руководство по работе с БРС для обучающегося</a>
            <p style={{
                width: '400px',
                fontSize: '20px',
                textAlign: 'justify'
            }}>
                Для перехода в разделы
                учебного и внеучебного рейтингов
                выберите одну из вкладок в меню слева
            </p>
        </>
    )

}

export const pageProps = { secure: true }

export const layoutProps = {
    backUrl: '/home/personal-area',
    sidebarStyle: {
        logoBackground: '#dff0d8',
        sidebarBackground: 'linear-gradient(to bottom, #dff0d8 0, #dff0d8 50%, #f6ffeb 100%)',
        border: '1px solid #dce3ec',
        logoColor: '#2858a9',
        navItemColor: '#575d6d',
        navItemHoverColor: '#6e768a',
        buttonColorStyle: 'dark'
    },
    sidebarLinks: [
        { url: getUrlForOldIais(`dekanat/uspev/reit/student/study_reit.htm`), ext: true, title: 'Учебный рейтинг обучающегося' },
        { url: getUrlForOldIais(`dekanat/uspev/reit/student/unstudy_reit/index.htm`), ext: true, title: 'Внеучебный рейтинг обучающегося' }
    ],
    footerContactInfo: {
        phone: '(384-2) 58-32-89',
        localPhone: '4-62',
        email: 'ocpo@kemsu.ru'
    }
}

export { default as Layout } from 'share/eios/layout/Layout'
