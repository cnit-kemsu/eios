import React, { useEffect, useState, useCallback } from 'react'
import { Helmet } from 'react-helmet'
import { Tabs, Tab, List, useTabs, useList } from '@kemsu/eios-ui'
import { HistoryManager } from '@kemsu/react-routing'

import { getFacultyInfo, setFacultyInfo, fetchApi, requestToOldIais } from 'share/utils'

import { topbarLinks } from '../links'

const sortEducUnits = (a, b) => {
    if (a.content < b.content) return -1
    if (a.content > b.content) return 1
    return 0
}

const convertApiData = data => data.map(item => ({ content: item.TITLE, value: item.ID }))


export default function DekanatPage() {    

    const showFaculties = !!localStorage.getItem("eios.dekanat.showFaculties")
    const facultyInfo = getFacultyInfo()

    const tabs = useTabs("fullTime")
    const [educUnitList, setEducUnitList] = useState({ fullTime: [], extramural: [] })

    const onChangeList = useCallback((val ,content) => {

        setFacultyInfo(val, content, showFaculties, tabs.tab === "extramural")

        requestToOldIais('dekanat/fac.htm', {
            in_faculty_id: val
        }, null, true)       
        
        HistoryManager.push('/dekanat/faculty')

    }, [tabs.tab, showFaculties])

    const list = useList(facultyInfo ?.id, onChangeList)    

    useEffect(() => {        

        (async () => {

            let result, resultExtr;
            

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

            setEducUnitList({
                fullTime: result.sort(sortEducUnits),
                extramural: resultExtr.sort(sortEducUnits)
            })

        })()

    }, [showFaculties])    

    return (
        <>
            <Helmet>
                <title>ЭИОС: Деканат</title>
            </Helmet>
            <h1>Деканат</h1>
            <h2>{showFaculties ? 'Факультеты' : 'Институты'}</h2>
            <Tabs {...tabs} stretchTabs>
                <Tab id="fullTime">Очная и очно-заочная форма</Tab>
                <Tab id="extramural">Заочная форма</Tab>
            </Tabs>
            <div>
                <List {...list} flat items={tabs.tab === "fullTime" ? educUnitList.fullTime : educUnitList.extramural} />
            </div>
        </>
    )
}

export const pageProps = {
    secure: true
}

export const layoutProps = {
    topbarLinks,
    backUrl: '/employee-area'
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
        { title: 'Статистика', url: '/dekanat/statistics' }
    ],
}