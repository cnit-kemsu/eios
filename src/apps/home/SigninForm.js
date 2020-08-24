import React, { useState, useCallback } from 'react'
import queryString from 'query-string'
import { Button, TextField, Spinner, useTextField } from '@kemsu/eios-ui'
import { Link, HistoryManager } from '@kemsu/react-routing'
import { isAccessTokenValid, auth, /*requestToOldIais,*/ authInOldIais } from 'share/utils'

import { textFieldContainerCss, submitButtonCss, submitButtonContainerCss } from './authFormStyle'


/*function authInOldSystem(login, password, url, server) {

    return new Promise((resolve, reject) => {

        let cancel = false

        setTimeout(() => {
            cancel = true
            reject()
        }, 15000);

        (async () => {

            await requestToOldIais(url, {
                login: login,
                password: encodeURI(password),
                _t: Date.now()
            }, true, server)

            await requestToOldIais(url, {
                login: login,
                password: encodeURI(password),
                _t: Date.now()
            }, true, server)

            if (!cancel) resolve();

        })()

    });

}*/


const oldSystemAuthUrls = [
    { url: 'restricted/index_next.htm', server: 'riais' },
    { url: 'restricted/index_next.htm', server: 'niais' },    
    { url: 'entrant_2019/security/index_next.htm', server: 'xiais' },
    { url: 'restricted/index_next.htm', server: 'xiais' },
    
]


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

            const oldSystemUrl = oldSystemAuthUrls[Math.round(Math.random())]            

            try {
                await authInOldIais(login, password, oldSystemUrl.url, oldSystemUrl.server)
            } catch (err) {
                console.log(err)
                try {                
                    await authInOldIais(login, password, oldSystemAuthUrls[2].url, oldSystemAuthUrls[2].server)
                } catch(err) {
                    console.log(err)
                    alert("Извините, в данный момент сервера загружены. Попробуйте войти позднее.")
                    return
                }
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
            HistoryManager.push(backUrl || '/personal-area')


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
                {isAccessTokenValid() && <Button elementType={Link} to='/personal-area' style={{ marginLeft: '9.6px' }} css={submitButtonCss} colorStyle='secondary'>Личный кабинет</Button>}
            </div>
        </form>
    )
}