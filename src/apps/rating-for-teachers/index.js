import React, { useState, useEffect, useCallback } from 'react'
import { css } from '@emotion/core'
import { Table, Select, Button, useSelect, Spinner } from '@kemsu/eios-ui'

import {
    makeAppGenerator, getUrlForOldIais, requestToOldIais,
    fetchApi, checkAccessTo, getUserFullName, logout
} from 'share/utils'
import Loading from 'share/eios/Loading'


const containerCss = css`
    display: flex;    
    justify-content: center;
`

const allFacCss = css`
    display: flex;       
    align-items: center; 

    & > * {
        margin-right: 14px;
    }
`


export const appGenerator = makeAppGenerator(({ setError }) => {

    const curFacultyInStorageStr = localStorage.getItem('reitFaculty')
    const curFacultyInStorage = curFacultyInStorageStr ? JSON.parse(curFacultyInStorageStr) : null


    const [isAdmin, setIsAdmin] = useState(false)
    const [userFaculties, setUserFaculties] = useState([])
    const [faculties, setFaculties] = useState([])
    const [loadFacultiesInProcess, setLoadFacultiesInProcess] = useState(false)
    const [chooseFacultyForAdminInProcess, setChooseFacultyForAdminInProcess] = useState(false)

    const facultySelect = useSelect(curFacultyInStorage ?.index)


    const chooseFacultyForAdmins = useCallback(() => {

        setChooseFacultyForAdminInProcess(true)

        const curFaculty = faculties[facultySelect.value]

        localStorage.setItem('reitFaculty', JSON.stringify({ ...curFaculty, index: facultySelect.value }))

        requestToOldIais('dekanat/uspev/reit/index.htm', { in_faculty_id: curFaculty.ID, formLink: curFaculty.TITLE, action: 'setFaculty' }, () => {
            setChooseFacultyForAdminInProcess(false)
        }, true)

    }, [faculties, facultySelect.value])


    useEffect(() => {

        (async () => {

            setLoadFacultiesInProcess(true)

            let result = await fetchApi('dekanat/faculties?byUserId')

            if (!result.ok) {
                setError(result.statusText)
                return
            }

            let userFaculties = await result.json()

            result = await fetchApi('dekanat/faculties')

            if (!result.ok) {
                setError(result.statusText)
                return
            }

            let faculties = await result.json()

            result = await fetchApi('dekanat/faculties?institutes')

            if (!result.ok) {
                setError(result.statusText)
                return
            }

            faculties = faculties.concat(await result.json())

            result = await fetchApi('dekanat/faculties?extramural')

            if (!result.ok) {
                setError(result.statusText)
                return
            }

            faculties = faculties.concat(await result.json())

            result = await fetchApi('dekanat/faculties?institutes&extramural')

            if (!result.ok) {
                setError(result.statusText)
                return
            }

            faculties = faculties.concat(await result.json())

            setUserFaculties(userFaculties)
            setFaculties(faculties)
            setIsAdmin(await checkAccessTo({ object: 'reit:facultyList' }))

            setLoadFacultiesInProcess(false)

        })()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <h1>Рейтинг обучающегося</h1>
            <Loading loading={loadFacultiesInProcess} title="Загрузка списка институтов (факультетов)...">
                <div css={containerCss}>

                    <Table style={{ width: '50%' }}>
                        <thead>
                            <tr>
                                <td style={{ background: '#dff0d8' }}>Список институтов (факультетов), к которым привязан ваш пользователь</td>
                                <td style={{ background: '#dff0d8' }}>Количество БСОД</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                userFaculties.map((fac, i) => (
                                    <tr key={i}>
                                        <td><a href={getUrlForOldIais('dekanat/uspev/reit/index.htm', { in_faculty_id: fac.FACULTY_ID, formLink: fac.FACULTY, action: 'setFaculty' }, true)}>{fac.FACULTY}</a></td>
                                        <td>{fac.LINK_CNT}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>

                </div>
                {
                    isAdmin
                    &&
                    <div style={{ marginTop: "1em" }}>
                        <h3>Для администраторов</h3>
                        <div css={allFacCss}>
                            <span>Выбор института/факультета для пользователей с дополнительными правами:</span>
                            <Select {...facultySelect} selectStyle={{ width: 'auto' }} size={12} flat
                                items={faculties.map((fac, i) => ({ content: fac.TITLE, value: i }))} />
                        </div>
                        <Button colorStyle='primary' style={{ width: '100px' }} disabled={chooseFacultyForAdminInProcess || facultySelect.value === undefined || facultySelect.value === null} onClick={chooseFacultyForAdmins}>
                            {chooseFacultyForAdminInProcess ? <Spinner colorStyle='light' style={{ width: '1em' }} /> : 'Выбрать'}
                        </Button>
                    </div>
                }
            </Loading>
        </>
    )

}, { secure: true })


export const layoutProps = {

    onLogoutButtonClick: logout,

    sidebarStyle: {
        logoBackground: '#dff0d8',
        sidebarBackground: 'linear-gradient(to bottom, #dff0d8 0, #dff0d8 50%, #f6ffeb 100%)',
        border: '1px solid #dce3ec',
        logoColor: '#2858a9',
        navItemColor: '#575d6d',
        navItemHoverColor: '#6e768a',
        buttonColorStyle: 'dark'
    },

    footerContactInfo: {
        phone: '(384-2) 58-32-89',
        localPhone: '4-62',
        email: 'ocpo@kemsu.ru'
    },

    sidebarLinks: [
        { url: getUrlForOldIais(`dekanat/uspev/reit/study_reit/index.htm`), ext: true, title: 'Учебный рейтинг обучающегося' },
        { url: getUrlForOldIais(`dekanat/uspev/reit/scientific_rating/index.htm`), ext: true, title: 'Внеучебный рейтинг обучающегося' },
        { url: getUrlForOldIais(`dekanat/uspev/reit/otchet/index.htm`), ext: true, title: 'Отчеты' },
        { url: getUrlForOldIais(`dekanat/uspev/reit/admin/index.htm`), ext: true, title: 'Администрирование' },
        { url: getUrlForOldIais(`dekanat/uspev/reit/portfolio/index.htm`), ext: true, title: 'Портфолио обучающегося' }
    ],

    topbarLinks: [
        { url: '/home', title: 'Главная страница' },
        { url: '/rating-for-teachers', title: 'Рейтинг обучающегося' }
    ],

    backUrl: '/personal-area'
}

export const funcLayoutProps = {
    username: getUserFullName
}

export { default as Layout } from 'share/eios/layout/Layout'