import React from 'react'
import { css } from '@emotion/core'

import { employeePages } from 'share/eios/employeePages'
import LinkList from 'share/eios/LinkList'
import { getUrlForOldIais, makeAppGenerator, getUserFullName, logout } from 'share/utils'
import { cnitContacts } from 'share/eios/cnitContacts'

import { topbarLinks } from './links'


const accountancyLinks = [
    {
        target: '_blank', url: getUrlForOldIais("orders/"), ext: true, title: "Заказ справок о доходах для обучающихся очной формы обучения:", sublinks: [
            { target: '_blank', url: getUrlForOldIais("orders/orders_list/index.htm"), ext: true, title: "Список заявок на справки о доходах от обучающихся" }
        ]
    }
]

const dekanatLinks = [
    { url: '/dekanat', title: 'Деканат' },
    {
        target: '_blank', url: 'http://ars.kemsu.ru/', ext: true, title: 'Информационная база показателей деятельности научно-педагогических работников КемГУ'/*, sublinks: [
            { target: '_blank', url: getUrlForOldIais('ars/index.htm'), ext: true, title: 'Достижения' }
        ]*/
    },
    {
        target: '_blank', url: 'http://edu.kemsu.ru/res/my.shtm', ext: true, title: 'Выпускные квалификационные работы обучающихся:', sublinks: [
            { target: '_blank', url: 'http://edu.kemsu.ru/res/vkr/chgKaf.htm', ext: true, title: 'Занесение ВКР' },
            { target: '_blank', url: 'http://edu.kemsu.ru/res/vkr/index.htm', ext: true, title: 'Поиск ВКР' }
        ]
    },
    { url: 'https://eios.kemsu.ru/a/gov-assign', ext: true, title: 'Среднегодовой контингент обучающихся' },
    { url: 'https://eios.kemsu.ru/a/stud-pers-dep', ext: true, title: 'Вакантные бюджетные места' },
    { url: 'https://eios.kemsu.ru/a/transfert', ext: true, title: 'Перенос данных из ИС Деканат [Шахты] в ИС Деканат' }

]

const autoLinks = [
    { target: '_blank', url: getUrlForOldIais('entrant_2019/index.htm'), ext: true, title: 'Абитуриент' },
    { target: '_blank', url: 'http://sed.kemsu.ru/', ext: true, title: 'Система электронного документооборота' },
    { target: '_blank', url: getUrlForOldIais('purchases/index.htm'), ext: true, title: 'Закупки' },
    { target: '_blank', url: getUrlForOldIais('equipment_new/index.htm'), ext: true, title: 'Учет компьютерой техники' },
    { target: '_blank', url: getUrlForOldIais('audit/soft/index.shtm'), ext: true, title: 'Учет программного обеспечения' },
    { target: '_blank', url: getUrlForOldIais('audit/kadastr/index.htm'), ext: true, title: 'Кадастр' },
    { target: '_blank', url: getUrlForOldIais('audit/dispatcher/index.htm'), ext: true, title: 'Диспетчер' },
    { target: '_blank', url: getUrlForOldIais('ALLOWANCE/index.htm'), ext: true, title: 'Выдача пропусков' },
    { url: 'https://eios.kemsu.ru/a/abiturient-admin/', ext: true, title: 'Анкета абитуриента' },
]

const studDep = [
    { url: 'https://eios.kemsu.ru/a/pgas-admin', title: "Повышенная государственная академическая стипендия (ПГАС)", ext: true },
    { url: 'https://eios.kemsu.ru/a/pgas-group-activity', title: "Групповые достижения (ПГАС)", ext: true }
]

const containerCss = css`    
    
    & > div {
        margin-top: 21px;
        &:first-of-type {
            margin-top: 0px;
        }
    }
`

export const appGenerator = makeAppGenerator(() => (
    <div>        

        <div css={containerCss}>
            <div>
                <h3>Деканат, кафедра</h3>
                <LinkList links={dekanatLinks} />
            </div>

            <div>
                <h3>Бухгалтерия</h3>
                <LinkList links={accountancyLinks} />
            </div>

            <div>
                <h3>Автоматизация делопроизводства и управления</h3>
                <LinkList links={autoLinks} />
            </div>

            <div>
                <h3>Управление по молодежной политике</h3>
                <LinkList links={studDep} />
            </div>

        </div>
    </div>
), {
    secure: true
})

export const layoutProps = {
    contentTitle: 'Кабинет сотрудника',
    onLogoutButtonClick: logout,
    topbarLinks,
    sidebarLinks: employeePages('employee'),
    footerContactInfo: cnitContacts
}

export const funcLayoutProps = {
    username: getUserFullName
}

export { default as Layout } from 'share/eios/layout/Layout'

