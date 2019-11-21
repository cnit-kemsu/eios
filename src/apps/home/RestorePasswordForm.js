import React, { useState, useCallback } from 'react'
import { Button, TextField, useTextField } from '@kemsu/eios-ui'
import { requestToOldIais, fetchApi } from 'share/utils'

import { textFieldContainerCss, submitButtonCss, submitButtonContainerCss } from './authFormStyle'

export default function RestorePasswordForm({ onMessage }) {

    const [restorePasswordInProgress, setRestorePasswordInProgress] = useState(false)
    const submitHandler = useCallback(async (e) => {
        e.preventDefault()

        const login = e.target.username.value
        const email = e.target.email.value

        onMessage(null)
        setRestorePasswordInProgress(false)

        let response = await fetchApi('security/password/check-login-and-email', {
            method: "post",
            body: JSON.stringify({
                login: login,
                email: email
            })
        })

        if (!response.ok) {
            onMessage({
                text: <p>Возникла ошибка! Обратитесь к администраторам <br /> {response.statusText} </p>,
                type: "error"
            })
            setRestorePasswordInProgress(false)
            return
        }


        let result = await response.json()

        if (!result.success) {           

            onMessage({
                text: "Некорректный логин и/или e-mail!", 
                type: "error"
            })

            setRestorePasswordInProgress(false)

            return
        }

        requestToOldIais('dekanat/eios-next-sync/send-email-for-restore-pswd.htm', {
            login: login,
            email: email
        }, () => {

            onMessage({
                text: "На Вашу почту отправлено письмо с дальнейшей инструкцией по восстановлению пароля.",
                type: "info"
            })

            setRestorePasswordInProgress(false)
                        
        }, true)


    }, [setRestorePasswordInProgress])

    const username = useTextField()
    const email = useTextField()

    return (
        <form onSubmit={submitHandler} method='post'>
            <div css={textFieldContainerCss}>
                <TextField {...username} flat borderless autoComplete="on" style={{ margin: '8px 0px' }} name="username" placeholder='логин' required />
                <TextField {...email} flat borderless autoComplete="on" style={{ margin: '8px 0px' }} name="email" type='email' placeholder='почта' required />
            </div>
            <div css={submitButtonContainerCss}>
                <Button disabled={restorePasswordInProgress} type='submit' css={submitButtonCss} colorStyle="secondary">
                    Отправить
                </Button>
            </div>
        </form>
    )
}