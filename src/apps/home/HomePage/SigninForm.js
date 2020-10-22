import React, { useState, useCallback } from 'react'
import queryString from 'query-string'
import { Button, TextField, Spinner, useTextField } from '@kemsu/eios-ui'
import { Link, HistoryManager } from '@kemsu/react-routing'
import { isAccessTokenValid, auth, authInOldIais/*, authInOldSystem*/ } from 'share/utils'

import { textFieldContainerCss, submitButtonCss, submitButtonContainerCss } from './authFormStyle'

window.authInOldIais = authInOldIais


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

            try {
                await authInOldIais(login, password)                
                //await authInOldSystem(login, password, 'dekanat/restricted/index_next.htm', 'xiais')
            } catch (err) {
                console.error(err)
            }


            if (/[а-яА-Я]+/.test(login) || /[а-яА-Я]+/.test(password)) {

                setAuthInProgress(false)
                onMessage({
                    text: "Логин и пароль должны состоять из латинских букв и цифр. Для смены логина и пароля обратитесь, пожалуйста, в деканат!",
                    type: "warning"
                })

                return
            }

            setAuthInProgress(false)
            HistoryManager.push(backUrl || '/home/personal-area')


        } catch (err) {

            const { status, message } = err

            if (status === 400 || status === 401) {

                onMessage({ text: message, type: 'error' })
                setAuthInProgress(false)

            } else {
                setError(message)
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
                    {authInProgress ? <Spinner colorStyle='light' style={{ width: '1em' }} /> : 'Войти'}
                </Button>
                {isAccessTokenValid() && <Button elementType={Link} to='/home/personal-area' style={{ marginLeft: '9.6px' }} css={submitButtonCss} colorStyle='secondary'>Личный кабинет</Button>}
            </div>
        </form>
    )
}