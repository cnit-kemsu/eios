import React from 'react'
import { Link } from '@kemsu/react-routing'
import { Message } from '@kemsu/eios-ui'

import { isAccessTokenValid, getUserInfo, checkAccessTo } from './auth'
import { checkAuth } from './old-iais'


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

export function makeAppGenerator(App, { secure, ignoreNotChangedPassword }) {
    return async () => {
        const checkResult = await performAuthСheck({ secure, ignoreNotChangedPassword })
        if (checkResult === true) return ({ default: App })
        return ({ default: checkResult })
    }
}

/**
 * Проверяет авторизацию пользователя на iais, затем проверяет доступ в соотвествии с объектом secure.
 * В случае, если в iais пользователь не авторизован, произойдет выход и страница перезагрузится
 * Если проверка secure не пройдет, то вернется React-элемент с сообщением, почему у пользователя нет доступа.
 * Иначе вернет true
 */
export async function performAuthСheck({ secure, ignoreNotChangedPassword } = {}) {

    await checkAuth()

    if (typeof secure === 'function') secure = secure()
    if (secure ?.then) secure = await secure

    if (secure) {

        let userInfo = getUserInfo()

        if (!isAccessTokenValid()) {
            return NeedAuthMessage
        } else if (secure === true && !ignoreNotChangedPassword && userInfo.blocked === 2) {
            return NeedChangedPasswordMessage
        } else if (secure === false) {
            return ClosedAccessMessage
        } else if (typeof secure === 'object' && !(await checkAccessTo(secure))) {
            return NoAccessMessage
        }
    }

    return true
}

function makePageLoader(appName, defaultPageModule) {
    return () => {
        if (location.pathname === `/${appName}`) return defaultPageModule
        else return import(`../../apps/${appName}/${location.pathname.split('/').slice(2).join('/')}/index.js`)
    }
}

export function makePageGenerator(appName, rootPageModule/*, defaultProps*/) {
    return async () => {
        
        const loader = makePageLoader(appName, rootPageModule)        

        let pageModule = loader()
        if (pageModule.then) pageModule = await pageModule

        let { pageProps } = pageModule

        let checkResult = await performAuthСheck(pageProps)

        if (checkResult !== true) return { default: checkResult }

        //const { layoutProps: defaultLayoutProps, funcLayoutProps: defaultFuncLayoutProps } = defaultProps || {}

        pageModule = {
            default: pageModule.default || pageModule.Page,
            layoutProps: Object.assign({}, /*defaultLayoutProps,*/ pageModule.layoutProps),
            funcLayoutProps: Object.assign({}, /*defaultFuncLayoutProps,*/ pageModule.funcLayoutProps)
        }

        return pageModule
    }
}