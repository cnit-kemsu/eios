import React, { useEffect, useCallback } from 'react'
import { Tabs, Tab, List, useTabs, useList } from '@kemsu/eios-ui'
import { HistoryManager } from '@kemsu/react-routing'

import { useAsync } from 'share/hooks'
import Loading from 'share/eios/Loading'
import { getFacultyInfo, setFacultyInfo, fetchApi, requestToOldIais } from 'share/utils'
import { getUrlForOldIais } from 'share/utils'

import { topbarLinks } from '../links'

const sortEducUnits = (a, b) => {
    if (a.content < b.content) return -1
    if (a.content > b.content) return 1
    return 0
}

const convertApiData = data => data.map(item => ({ content: item.TITLE, value: item.ID }))


const educUnitListInitialValue = { fullTime: [], extramural: [] }

export default function DekanatPage({ setError }) {

    const showFaculties = !!localStorage.getItem("eios.dekanat.showFaculties")
    const facultyInfo = getFacultyInfo()

    const tabs = useTabs("fullTime")

    const onChangeList = useCallback((val, content) => {

        setFacultyInfo(val, content, showFaculties, tabs.tab === "extramural")

        requestToOldIais('dekanat/fac.htm', {
            in_faculty_id: val
        }, null, true)

        HistoryManager.push('/dekanat/faculty')

    }, [tabs.tab, showFaculties])

    const list = useList(facultyInfo ?.id, onChangeList)

    const educUnitList = useAsync(async () => {

        let result, resultExtr

        if (showFaculties) {
            result = await fetchApi('dekanat/faculties')
            resultExtr = await fetchApi('dekanat/faculties?extramural')

            result = convertApiData(await result.json())
            resultExtr = convertApiData(await resultExtr.json())

        } else {
            result = await fetchApi('dekanat/faculties?institutes')
            resultExtr = await fetchApi('dekanat/faculties?institutes&extramural')

            result = convertApiData(await result.json())
            resultExtr = convertApiData(await resultExtr.json())

            result.push({ content: "Физической культуры и спорта", value: 125 })
            resultExtr.push({ content: "ОЗО Физической культуры и спорта", value: 296 })

            result.push({ content: "Среднетехнический факультет", value: 668 })
            resultExtr.push({ content: "ОЗО Среднетехнический факультет", value: 669 })

            result.push({ content: "Аспирантура", value: 347 })
            resultExtr.push({ content: "ОЗО Аспирантура", value: 348 })
        }

        return {
            fullTime: result.sort(sortEducUnits),
            extramural: resultExtr.sort(sortEducUnits)
        }

    }, educUnitListInitialValue, [showFaculties])

    useEffect(() => {
        educUnitList.error && setError(educUnitList.error)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [educUnitList.error])

    return (
        <>
            <h2>{showFaculties ? 'Факультеты' : 'Институты'}</h2>

            <Tabs {...tabs} stretchTabs>
                <Tab id="fullTime">Очная и очно-заочная форма</Tab>
                <Tab id="extramural">Заочная форма</Tab>
            </Tabs>
            <div>
                <List {...list} flat items={tabs.tab === "fullTime" ? educUnitList.value.fullTime : educUnitList.value.extramural} />
            </div>
            <Loading delay={1} loading={educUnitList.loading} title='Загрузка списка институтов/факультетов...' />
        </>
    )
}

export const pageProps = {
    secure: true
}

export const layoutProps = {
    topbarLinks,
    backUrl: '/home/employee-area',
    contentTitle: 'Деканат'
}

export const funcLayoutProps = {
    sidebarLinks: (_, forceUpdate) => [
        {
            selected: !localStorage.getItem("eios.dekanat.showFaculties"),
            title: "Институты",
            onClick() {
                if (localStorage.getItem("eios.dekanat.showFaculties")) {
                    localStorage.removeItem("eios.dekanat.showFaculties")
                    forceUpdate()
                }
            }
        },
        {
            selected: localStorage.getItem("eios.dekanat.showFaculties"),
            title: "Факультеты",
            onClick() {
                if (!localStorage.getItem("eios.dekanat.showFaculties")) {
                    localStorage.setItem("eios.dekanat.showFaculties", 1)
                    forceUpdate()
                }
            }
        },
        { /*target: '_blank',*/ title: "Отчетность", url: getUrlForOldIais("dekanat/rep/index.htm"), ext: true },
        { /*target: '_blank',*/ title: "Рейтинг обучающихся", url: '/home/personal-area/rating-for-teachers' /*getUrlForOldIais("dekanat/uspev/reit/index.htm")*/ },
        { /*target: '_blank',*/ title: "Успеваемость обучающихся", url: getUrlForOldIais("dekanat/studs/index.htm"), ext: true },
        { /*target: '_blank',*/ title: "Распределение выпускников", url: getUrlForOldIais("dekanat/raspred/index.htm"), ext: true }
    ],
}