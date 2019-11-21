import React from 'react'

import { makePageGenerator, getUserFullName, logout, redirectToOldIais } from 'share/utils'
import { cnitContacts } from 'share/eios/cnitContacts'

import * as rootPageModule from './DekanatPage'


export const appGenerator = makePageGenerator('dekanat', rootPageModule)

export { default as Layout } from 'share/eios/layout/Layout'

export const layoutProps = {
    footerContactInfo: cnitContacts,
    onLogoutButtonClick: logout,
    onUsernameClick: () => redirectToOldIais('security/my/index.htm')
}

export const funcLayoutProps = {
    topbarAdditionalInfo: () => (
        <div style={{ marginRight: '28px' }}>
            <div style={{ textDecoration: 'none', fontSize: '13.6px' }}>TODO: выводить факультет</div>
        </div>
    ),
    username: getUserFullName
}