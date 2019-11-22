import React, { useState, useEffect } from 'react'

import { Message } from '@kemsu/eios-ui'
import { Link } from '@kemsu/react-routing'

import { isAccessTokenValid, getUserInfo, checkAccessTo } from '../utils/auth'
import { checkAuth } from '../utils/old-iais'


const authErrorMessages = [
    redirect => <>Для доступа к данной странице требуется <Link to={`/home${redirect ? `?backUrl=${location.pathname}` : ''}`}>войти в систему!</Link></>,
    "Перед началом работы необходимо сменить пароль!",
    "На текущий момент доступ к данной странице закрыт!",
    "У Вас отсутствует доступ к данной странице!"
]

export function Auth({ authState, redirect, children }) {
    if (authState == 0) return null
    if (authState == 1) return children
    return (
        <Message type="error">
            {authState == 2 ? authErrorMessages[0](redirect) : authErrorMessages[authState - 2]}
        </Message>
    )
}

export function useAuth({ secure, ignoreNotChangedPassword }) {

    const [authState, setAuthState] = useState(0)

    useEffect(() => {
        (async () => {

            await checkAuth()

            let s = secure

            if (typeof s === 'function') s = s()
            if (s ?.then) s = await s

            if (s) {

                let userInfo = getUserInfo()

                if (!isAccessTokenValid()) {
                    setAuthState(2)
                } else if (secure === true && !ignoreNotChangedPassword && userInfo.blocked === 2) {
                    setAuthState(3)
                } else if (secure === false) {
                    setAuthState(4)
                } else if (typeof secure === 'object' && !(await checkAccessTo(secure))) {
                    setAuthState(5)                    
                }else {
                    setAuthState(1)
                }           
                
                return
            }

            setAuthState(1)

        })()
    }, [])

    return { authState }
}