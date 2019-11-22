import React, { useState, useEffect } from 'react'

import { getUserFullName, makeAppGenerator, fetchApi } from 'share/utils'
import { cnitContacts } from 'share/eios/cnitContacts'
import { studentPages } from 'share/eios/studentPages'
import { DataRow } from 'share/eios/DataRow'

import { topbarLinks } from './links'




export const appGenerator = makeAppGenerator(({ setError }) => {

    const [info, setInfo] = useState()


    useEffect(() => {

        (async () => {

            let result = await fetchApi('dekanat/students/common-info')

            if (!result.ok) {
                setError(result.statusText)
                return
            }

            setInfo(await result.json())

        })()

    }, [])


    if (!info) return null

    return (
        <div>
            <DataRow title='ФИО' value={`${info.lastName} ${info.firstName || ''} ${info.middleName || ''}`} />
            <DataRow title='Пол' value={info.gender} />
            <DataRow title='Дата рождения' value={(new Date(info.birthDate)).toLocaleDateString()} />
            <DataRow title='Серия и номер паспорта' value={`${info.passportSeries} ${info.passportNumber}`} />
            <DataRow title='Кем выдан паспорт' value={info.whoGivePassport} />
            <DataRow title='Дата выдачи паспорта' value={(new Date(info.passportDate)).toLocaleDateString()} />
        </div>
    )

}, { secure: true })

export { default as Layout } from 'share/eios/layout/Layout'

export const layoutProps = {
    footerContactInfo: cnitContacts,
    topbarLinks,
    sidebarLinks: studentPages('data')
}

export const funcLayoutProps = {
    username: getUserFullName
}

