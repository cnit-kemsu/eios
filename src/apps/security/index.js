import { cnitContacts } from 'share/eios/cnitContacts'

import * as rootPage from './RootPage'

import { redirectToOldIais, makePageGenerator, getUserFullName, logout, getFacultyInfo } from 'share/utils'


export const appGenerator = makePageGenerator('security', rootPage)

export const layoutProps = {
    onLogoutButtonClick: logout,
    footerContactInfo: cnitContacts,    
    onUsernameClick: () => redirectToOldIais('security/my/index.htm')
}

export const funcLayoutProps = {
    topbarAdditionalInfo: () => getFacultyInfo()?.name || "",
    username: getUserFullName
}