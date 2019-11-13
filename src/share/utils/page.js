import React from 'react'
import { isAccessTokenValid, getUserInfo, checkAccessTo } from 'share/utils'
import { Link } from '@kemsu/react-routing'
import { Message } from '@kemsu/eios-ui'


const NeedAuthMessage = () => (
    <Message type='error'>
        Для доступа к данной странице требуется  <Link to='/home'>войти в систему!</Link>
    </Message>
)

const NeedChangedPasswordMessage = () => (
    <Message type='error'>
        Перед началом работы необходимо сменить пароль!
    </Message>
)

const NoAccessMessage = () => (
    <Message type='error'>
        У Вас отсутствует доступ к данной странице!
    </Message>
)

const ClosedAccessMessage = () => (
    <Message type='error'>
        На текущий момент доступ к данной странице закрыт!
    </Message>
)

export function makeAppPageGenerator(appName, defaultPageModule, defaultProps) {
    return async () => {

        let pageModule

        if (location.pathname === `/${appName}`) pageModule = defaultPageModule
        else pageModule = await import(`../../apps/${appName}/${location.pathname.split('/').slice(2).join('/')}/index.js`)

        let { pageProps: { secure, ignoreNotChangedPassword } = {} } = pageModule

        if (typeof secure === 'function') secure = secure()
        if (secure ?.then) secure = await secure

        if (secure) {

            let userInfo = getUserInfo()

            if (!isAccessTokenValid()) {
                return {
                    'default': NeedAuthMessage
                }
            } else if (secure === true && !ignoreNotChangedPassword && userInfo.blocked === 2) {
                return {
                    'default': NeedChangedPasswordMessage
                }
            } else if (secure === false) {
                return {
                    'default': ClosedAccessMessage
                }
            } else if (typeof secure === 'object' && !(await checkAccessTo(secure))) {
                return {
                    'default': NoAccessMessage
                }
            }
        }

        const { layoutProps: defaultLayoutProps, funcLayoutProps: defaultFuncLayoutProps } = defaultProps || {}

        pageModule = {
            default: pageModule.default,
            layoutProps: Object.assign({}, defaultLayoutProps, pageModule.layoutProps),
            funcLayoutProps: Object.assign({}, defaultFuncLayoutProps, pageModule.funcLayoutProps)
        }

        return pageModule
    }
}