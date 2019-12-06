import React, { useState, useEffect, useCallback } from 'react'
import { css } from '@emotion/core'
import { Table, Select, Button, useSelect, Spinner } from '@kemsu/eios-ui'

import { makeAppGenerator, getUrlForOldIais, requestToOldIais, fetchApi, checkAccessTo, getUserFullName } from 'share/utils'


const hrefCss = css` 

    display: inline-block;
    padding: 6px;
    padding-left: 0px;    
    text-decoration: none;
    color: #575d6d;    
    transition: color 0.5s;
    cursor: pointer;
    font-size: 16px;

    &:hover {
        text-decoration: underline;
    }
`

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

        })()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <h1>Рейтинг обучающегося</h1>

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
                <div>
                    <h3>Для администраторов</h3>
                    <div css={allFacCss}>
                        <span>Выбор института/факультета для пользователей с дополнительными правами:</span>
                        <Select {...facultySelect} selectStyle={{ width: '420px' }} size={20} flat
                            items={faculties.map((fac, i) => ({ content: fac.TITLE, value: i }))} />
                    </div>
                    <Button colorStyle='primary' style={{width: '100px'}} disabled={chooseFacultyForAdminInProcess || facultySelect.value === undefined || facultySelect.value === null} onClick={chooseFacultyForAdmins}>
                        {chooseFacultyForAdminInProcess ? <Spinner colorStyle='light' style={{ width: '13px' }}/> : 'Выбрать'}                        
                    </Button>
                </div>
            }
        </>
    )

}, { secure: true })

export const layoutProps = {
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
    ]
}

export const funcLayoutProps = {
    username: getUserFullName
}

export { default as Layout } from 'share/eios/layout/Layout'