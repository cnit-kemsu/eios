import React from 'react'

import { makePageGenerator, getUserFullName, logout, redirectToOldIais, getFacultyInfo } from 'share/utils'
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
    topbarAdditionalInfo: () => getFacultyInfo()?.name || "",
    username: getUserFullName
}