import React from 'react'
import { Tabs, Tab, useTabs } from '@kemsu/eios-ui'

import { getUserFullName, logout } from 'share/utils'
import { cnitContacts } from 'share/eios/cnitContacts'

import {
    rootCss, colCss, leftColImageContainerCss, dblColCss,
    loginFormRowCss, infoContainerCss
} from './style'

import AuthForm from './AuthForm'
import StudentInfo from './StudentInfo'
import EmployeeInfo from './EmployeeInfo'

export default function App({ setError }) {

    const tabs = useTabs('student')

    return (
        <>            
            <div css={rootCss}>
                <div css={[colCss, leftColImageContainerCss]}>
                    <img src="/assets/images/home.jpg" />
                </div>
                <div css={dblColCss}>
                    <a name='login'></a>
                    <Tabs {...tabs} style={{ marginLeft: '3vw' }} stretchTabs>
                        <Tab id='student'>ВХОД ОБУЧАЮЩЕГОСЯ</Tab>
                        <Tab id='employee'>ВХОД РАБОТНИКА</Tab>
                    </Tabs>
                    <div style={{ padding: '0px', marginLeft: '3vw' }}>
                        <div css={loginFormRowCss}>
                            <div css={colCss}>
                                <AuthForm setError={setError} />
                            </div>
                            <div css={[colCss, infoContainerCss]}>
                                {tabs.tab === 'student' ? <StudentInfo /> : <EmployeeInfo />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export { default as Layout } from 'share/eios/layout/Layout'

export const layoutProps = {
    footerLinks: [
        { title: 'Заявка на регистрацию', ext: true, url: 'http://public.kemsu.ru/eios/docs/Заявка на регистрацию в ЭИОС.doc', icon: 'registration' },
        { title: 'Заявка на получение дополнительных прав', ext: true, url: 'http://public.kemsu.ru/eios/docs/Заявка на получение прав.doc', icon: 'rights' },
        { title: 'Документы пользователю', url: '/manuals', icon: 'doc' }
    ],
    footerContactInfo: cnitContacts,
    hideTopbar: true,
    hideSidebar: true,
    onLogoutButtonClick: logout,
    subtitle: 'Личный кабинет',
    contentTitle: 'Главная страница',
    showContentHeader: false
}

export const funcLayoutProps = {
    username: getUserFullName
}