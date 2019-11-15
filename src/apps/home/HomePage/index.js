import React from 'react'
import { Helmet } from 'react-helmet'
import { Tabs, Tab, useTabs } from '@kemsu/eios-ui'

import {
    rootCss, colCss, leftColImageContainerCss, dblColCss,
    loginFormRowCss, infoContainerCss
} from './style'

import AuthForm from './AuthForm'
import StudentInfo from './StudentInfo'
import EmployeeInfo from './EmployeeInfo'


export default function HomePage({ setError }) {

    const tabs = useTabs('student')    

    return (
        <>
            <Helmet>
                <title>ЭИОС: Главная страница</title>
            </Helmet>
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


export const layoutProps = {
    subtitle: 'Личный кабинет'
}