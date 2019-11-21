import React, { useState, useCallback } from 'react'
import queryString from 'query-string'
import { Button, TextField, useTextField } from '@kemsu/eios-ui'
import { Link, HistoryManager } from '@kemsu/react-routing'
import { isAccessTokenValid, auth, requestToOldIais } from 'share/utils'

import { textFieldContainerCss, submitButtonCss, submitButtonContainerCss } from './authFormStyle'


export default function SigninForm({ onMessage, setError }) {

    const [authInProgress, setAuthInProgress] = useState(false)
    const submitHandler = useCallback(async (e) => {

        e.preventDefault()

        localStorage.removeItem('lastActivity')

        onMessage(null)
        setAuthInProgress(true)

        const login = e.target.username.value
        const password = e.target.password.value

        try {

            await auth(login, password, null, true)

            const { backUrl } = queryString.parse(location.search)

            requestToOldIais('restricted/index_next.htm', {
                login: login,
                password: encodeURI(password),
                _t: Date.now()
            }, () => {


                requestToOldIais('restricted/index_next.htm', {
                    login: login,
                    password: encodeURI(password),
                    _t: Date.now()
                }, () => {

                    if (/[а-яА-Я]+/.test(login) || /[а-яА-Я]+/.test(password)) {
                        this.setState({
                            authInProgress: false,
                            warningInModal: "Логин и пароль должны состоять из латинских букв и цифр. Для смены логина и пароля обратитесь, пожалуйста, в деканат!",
                            restorePassswordInProgress: false
                        })
                        return
                    }

                    setAuthInProgress(false)

                    HistoryManager.push(backUrl || '/personal-area')                    

                }, true)

            }, true)


        } catch (err) {

            const { status, message } = err

            if (status === 400 || status === 401) {

                onMessage({ text: message, type: 'error' })
                setAuthInProgress(false)

            } else {
                setError(message)
            }
        }

    }, [setAuthInProgress])

    const username = useTextField()
    const password = useTextField()

    return (
        <form onSubmit={submitHandler} method='post'>
            <div css={textFieldContainerCss}>
                <TextField {...username} flat borderless autoComplete="on" style={{ margin: '8px 0px' }} name="username" placeholder='логин' required />
                <TextField {...password} flat borderless autoComplete="on" style={{ margin: '8px 0px' }} name="password" type='password' placeholder='пароль' required />
            </div>
            <div css={submitButtonContainerCss}>
                <Button disabled={authInProgress} type='submit' css={submitButtonCss} colorStyle="secondary">
                    Войти
                </Button>
                {isAccessTokenValid() && <Button elementType={Link} to='/personal-area' style={{ marginLeft: '9.6px' }} css={submitButtonCss} colorStyle='secondary'>Личный кабинет</Button>}
            </div>
        </form>
    )
}