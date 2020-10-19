import React, { useEffect, useState } from 'react'

import { fetchApi } from 'share/utils'
import { studentPages } from 'share/eios/studentPages'
import { DataRow } from 'share/eios/DataRow'

import { topbarLinks } from './links'

export function Page({ setError }) {

    const [studyCards, setStudyCards] = useState()

    useEffect(() => {

        (async () => {

            let result = await fetchApi('dekanat/students/study-cards')

            if (!result.ok) {
                setError(result.statusText)
                return
            }

            setStudyCards(await result.json())

        })()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!studyCards) return null

    return (
        <>
            <h1>Учебные карты</h1>
            <div style={{ width: '800px' }}>
                {
                    studyCards.map((studyCard, i) => (
                        <div style={{ paddingBottom: '12px', marginBottom: '12px', borderBottom: i === studyCards.length - 1 ? 'none' : `1px solid #dce3ec` }} key={i}>
                            <DataRow title='Институт/Факультет' value={studyCard.FACULTY} />
                            <DataRow title='Номер зачетной книжки' value={studyCard.NUM_STUDENT_BOOK} />
                            <DataRow title='Номер студенческого билета' value={studyCard.NUM_STUDENT_CARD} />
                            <DataRow title='Направление/Специальность' value={studyCard.SPECIALITY} />
                            <DataRow title='Профиль/Специализация' value={studyCard.SPECIALIZATION} />
                            <DataRow title='Группа' value={studyCard.GROUP_NAME} />
                            <DataRow title='Курс' value={studyCard.COURS} />
                            <DataRow title='Форма обучения' value={studyCard.LEARN_FORM} />
                            <DataRow title='Форма финансирования' value={studyCard.FINFORM} />
                            <DataRow title='Квалификация' value={studyCard.QUALIFICATION} />
                            <DataRow title='Статус' value={studyCard.STATUS_STR} />
                        </div>
                    ))
                }
            </div>
        </>
    )

}

export const pageProps = {
    secure: true
}

export { default as Layout } from 'share/eios/layout/Layout'

export const layoutProps = {    
    topbarLinks,
    sidebarLinks: studentPages('cards')
}

