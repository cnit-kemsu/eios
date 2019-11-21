import * as defaultPageModule from './HomePage'
import { makePageGenerator, getUserFullName, logout } from 'share/utils'
import { cnitContacts } from 'share/eios/cnitContacts'

// Используем древовидный загрузчик

export const appGenerator = makePageGenerator('home', defaultPageModule)

// Макет и его свойства по-умолчанию

export { default as Layout } from 'share/eios/layout/Layout'

export const layoutProps = {
    footerLinks: [
        { title: 'Заявка на регистрацию', ext: true, url: '/assets/docs/Заявка на регистрацию в ЭИОС.doc', icon: 'registration' },
        { title: 'Заявка на получение дополнительных прав', ext: true, url: '/assets/docs/Заявка на получение прав.doc', icon: 'rights' },
        { title: 'Документы пользователю', url: '/manuals', icon: 'doc' }
    ],
    footerContactInfo: cnitContacts,
    hideTopbar: true,
    hideSidebar: true,
    onLogoutButtonClick: logout
}

export const funcLayoutProps = {
    username: getUserFullName
}