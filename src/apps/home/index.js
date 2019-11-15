import * as homePageModule from './HomePage'
import { makeAppPageGenerator, getUserFullName, logout } from 'share/utils'

export const getAppPage = makeAppPageGenerator('home', homePageModule, {
    layoutProps: {
        footerLinks: [
            { title: 'Заявка на регистрацию', ext: true, url: '/assets/docs/Заявка на регистрацию в ЭИОС.doc', icon: 'registration' },
            { title: 'Заявка на получение дополнительных прав', ext: true, url: '/assets/docs/Заявка на получение прав.doc', icon: 'rights' },
            { title: 'Документы пользователю', url: '/manuals', icon: 'doc' }
        ],
        footerContactInfo: {
            phone: '(384-2) 58-32-89, 58-33-41, 58-44-03',
            localPhone: '4-62, 3-46, 4-65',
            email: 'ocpo@kemsu.ru'
        },
        hideTopbar: true,
        hideSidebar: true,
        onLogoutButtonClick: logout
    },
    funcLayoutProps: {
        username: getUserFullName        
    }
})

export { default as Layout } from '../../share/layout/Layout'
