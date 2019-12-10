import React, { useState, useEffect } from 'react'

import { getUserInfo, userIsStudent, userInfoExists, fetchApi, makeAppGenerator, getUserFullName, logout } from 'share/utils'
import { cnitContacts } from 'share/eios/cnitContacts'
import { studentPages } from 'share/eios/studentPages'
import { employeePages } from 'share/eios/employeePages'
import LinkList from 'share/eios/LinkList'

import { getEmployeeLinks } from './employeeLinks'
import { getStudentLinks } from './studentLinks'
import { topbarLinks } from './links'


export const appGenerator = makeAppGenerator(() => {

    const [facultyId, setFacultyId] = useState(null)
    const [graduateFlag, setGraduateFlag] = useState(false)

    useEffect(() => {
        (async () => {

            const { facultyId } = await fetchApi('dekanat/students/faculties/current', { toJSON: true })
            const graduateFlag = await fetchApi('dekanat/students/graduate-flag', { toJSON: true })

            setFacultyId(facultyId)
            setGraduateFlag(graduateFlag)

        })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getUserInfo() ?.id])

    if (!userInfoExists()) return null

    const isStudent = userIsStudent()

    if (isStudent && !facultyId) return null

    return (
        <div>            
            <LinkList links={isStudent ? getStudentLinks({ facultyId, graduateFlag }) : getEmployeeLinks()} />
        </div>
    )
}, {
    secure: true
})


export { default as Layout } from 'share/eios/layout/Layout'

export const layoutProps = {    
    onLogoutButtonClick: logout,
    footerContactInfo: cnitContacts
}

export const funcLayoutProps = {
    contentTitle: () => `Личный кабинет ${userIsStudent() ? 'обучающегося' : 'преподавателя'}`,
    username: getUserFullName,
    topbarLinks,
    sidebarLinks: () => userIsStudent() ? studentPages('personal') : employeePages('personal')
}

