import React, { useState, useCallback } from 'react'
import { Tabs, Tab, Modal, Message, useTabs } from '@kemsu/eios-ui'


import RestorePasswordForm from './RestorePasswordForm'
import SigninForm from './SigninForm'

import { rootCss, tabContentCss, messageCss, showMessageCss } from './authFormStyle'


export default function AuthForm({ setError }) {

    const [message, setMessage] = useState()
    const tabs = useTabs('signin')
    const [modalMessage, setModalMessage] = useState(null)
    const closeModalHandler = useCallback(() => setModalMessage(null), [setModalMessage])
    const messageHandler = useCallback((message) => setMessage(message), [setMessage])

    return (
        <div css={rootCss}>
            <Modal open={!!modalMessage} onClose={closeModalHandler}>
                {modalMessage}
            </Modal>
            <Tabs fillSelectedTab stretchTabs {...tabs}>
                <Tab id='signin'>Вход</Tab>
                <Tab id='restore_password'>Восстановление пароля</Tab>
            </Tabs>
            <div css={tabContentCss}>
                {tabs.tab === 'signin' ? <SigninForm setError={setError} onMessage={messageHandler} /> : <RestorePasswordForm setError={setError} onMessage={messageHandler} />}
            </div>
            <Message css={[messageCss, message ? showMessageCss : undefined]} type={message ?.type || 'error'}>{message ?.text}</Message>
        </div>
    )
}