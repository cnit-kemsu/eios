import React from 'react'

import { employeePages } from 'share/eios/employeePages'
import { getUrlForOldIais } from 'share/utils'
import LinkList from 'share/eios/LinkList'

import { topbarLinks } from './links'


const links = [
    { url: getUrlForOldIais('security/index.htm'), ext: true, title: 'Единая система защиты' },
    { url: getUrlForOldIais('dict/index.htm'), ext: true, title: 'Глоссарий' },
    { url: getUrlForOldIais('audit/log/index.htm'), ext: true, title: 'Аудит доступа к информационным системам' },
]

export function Page(){
    return (<div>        
        <LinkList links={links} />
    </div>)
}

export const pageProps = { 
    secure: true
}

export { default as Layout } from 'share/eios/layout/Layout'

export const layoutProps = {    
    topbarLinks,
    sidebarLinks: employeePages('admin'),    
    contentTitle: 'Кабинет администратора'
}



