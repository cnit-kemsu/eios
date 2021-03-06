import React from 'react'

import { employeePages } from 'share/eios/employeePages'
import { getUrlForOldIais, makeAppGenerator, logout } from 'share/utils'
import LinkList from 'share/eios/LinkList'
import { cnitContacts } from 'share/eios/cnitContacts'

import { topbarLinks } from './links'


const links = [
    { url: getUrlForOldIais('security/index.htm'), ext: true, title: 'Единая система защиты' },
    { url: getUrlForOldIais('dict/index.htm'), ext: true, title: 'Глоссарий' },
    { url: getUrlForOldIais('audit/log/index.htm'), ext: true, title: 'Аудит доступа к информационным системам' },
]

export const appGenerator = makeAppGenerator(() => (
    <div>        
        <LinkList links={links} />
    </div>
), { secure: true })

export { default as Layout } from 'share/eios/layout/Layout'

export const layoutProps = {
    onLogoutButtonClick: logout,
    topbarLinks,
    sidebarLinks: employeePages('admin'),
    footerContactInfo: cnitContacts,
    contentTitle: 'Кабинет администратора'
}



