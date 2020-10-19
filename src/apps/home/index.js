import { makePageGenerator } from 'share/utils'
import * as homePageModule from './HomePage'
import { getUserFullName, logout } from 'share/utils'

import { cnitContacts } from 'share/eios/cnitContacts'

export const appGenerator = makePageGenerator("home", homePageModule)


export { default as Layout } from 'share/eios/layout/Layout'

export const layoutProps = {
    footerContactInfo: cnitContacts,
    onLogoutButtonClick: logout,    
    contentTitle: 'Главная страница',
    showContentHeader: true
}

export const funcLayoutProps = {
    username: getUserFullName
}
