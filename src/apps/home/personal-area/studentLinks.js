import { contacts } from './contacts'
import { getUrlForOldIais, getUserInfo } from 'share/utils'


export const getStudentLinks = ({ facultyId, graduateFlag }) => [
    {
        target: '_blank', title: 'Образовательные программы:', sublinks: [

            { target: '_blank', ext: true, title: 'Реализуемые программы', url: 'https://kemsu.ru/education/educational-programs/', contact: contacts.webProjCenter },
            { title: 'Пакет документов для лицензирования', url: '/home/personal-area/lic-doc-package', contact: contacts.webProjCenter },

            ...((facultyId === 668 || facultyId === 669 || getUserInfo().id == 1240) ? [
                { url: '/home/personal-area/stf-work-program', title: 'Рабочие программы' },
                { url: '/home/personal-area/stf-valuation-funds', title: 'Фонды оценочных материалов' },
                { url: '/home/personal-area/stf-pract-guidlines', title: 'Методические указания к практическим работам' },
                { url: '/home/personal-area/stf-indep-guidlines', title: 'Методические указания по самостоятельной работе' },
            ]
                : [])
        ], contact: contacts.webProjCenter
    },
    { target: '_blank', url: 'https://kemsu.ru/education/schedule/', ext: true, title: 'Расписание занятий/сессий', contact: contacts.webProjCenter },
    { target: '_blank', url: 'http://www.kemsu.ru/', ext: true, title: 'Официальный сайт КемГУ', contact: contacts.webProjCenter },

    { /*target: '_blank',*/ url: '/home/personal-area/rating-for-students', title: 'Рейтинг обучающихся (БРС)', contact: contacts.cnitSupp },
    { /*target: '_blank',*/ url: getUrlForOldIais('proc/stud') /*'http://xiais.kemsu.ru/proc/stud/'*/, ext: true, title: 'Информационное обеспечение учебного процесса (ИнфОУПро)', contact: contacts.cnitSupp },
    { target: '_blank', url: 'http://moodle.kemsu.ru/', ext: true, title: 'Cистема управления курсами (Moodle)', contact: contacts.cnitSupp },
    { url: getUrlForOldIais('tests') /*'http://xiais.kemsu.ru/tests/'*/, ext: true, title: 'Система компьютерного адаптивного тестирования (СКАТ)', contact: contacts.cnitSupp },
    //{ url: 'https://iais-test.kemsu.ru/skat/', ext: true, title: 'Система компьютерного адаптивного тестирования 2.0 (СКАТ 2.0)' },
    {
        /*target: '_blank',*/ url: 'http://edu.kemsu.ru/res', ext: true, title: 'Депозитарий электронных образовательных ресурсов:', sublinks: [
            { /*target: '_blank',*/ url: 'http://edu.kemsu.ru/res/vkr/index.htm', ext: true, title: 'Поиск ВКР', contact: contacts.cnitSupp }
        ], contact: contacts.cnitSupp
    },
    { /*target: '_blank',*/ url: 'http://edu.kemsu.ru/res/elem/elem_simple.htm', ext: true, title: 'Информационно-образовательный портал КемГУ', contact: contacts.cnitSupp },
    { /*target: '_blank',*/ url: 'http://conference.kemsu.ru/', ext: true, title: 'Сервер конференций КемГУ', contact: contacts.cnitSupp },

    { /*target: '_blank',*/ url: 'http://lib.kemsu.ru/pages/default.aspx', ext: true, title: 'Научная библиотека КемГУ', contact: contacts.sciLib },
    {
        target: '_blank', title: 'Электронные библиотечные системы:', sublinks: [
            ...(facultyId === 668 || facultyId === 669 || getUserInfo().id == 1240 ? [
                { target: '_blank', url: 'https://academia-moscow.ru/elibrary/', ext: true, title: 'Издательский центр "Академия"' }
            ] : []),
            { target: '_blank', url: 'https://biblioclub.ru/index.php?page=main_ub_red', ext: true, title: 'Университетская библиотека онлайн', contact: contacts.sciLib },
            { target: '_blank', url: 'http://e.lanbook.com/', ext: true, title: 'Издательство "Лань"', contact: contacts.sciLib },
            { target: '_blank', url: 'https://biblio-online.ru/', ext: true, title: 'Издательство "ЮРАЙТ"', contact: contacts.sciLib },
            { target: '_blank', url: 'http://www.studentlibrary.ru/', ext: true, title: 'Консультант студента', contact: contacts.sciLib },
            { target: '_blank', url: 'http://znanium.com/', ext: true, title: 'Znanium.com', contact: contacts.sciLib },
            { target: '_blank', url: 'http://www.rosmedlib.ru/', ext: true, title: 'Консультант врача', contact: contacts.sciLib },
            { target: '_blank', url: 'https://academia-library.ru/', ext: true, title: 'ЭБ «Образовательно-издательский центр «Академия»', contact: contacts.sciLib },
            { target: '_blank', url: 'https://elibrary.ru/', ext: true, title: 'ЭБС ELIBRARY.RU «Научная электронная библиотека»', contact: contacts.sciLib },
        ], contact: contacts.sciLib
    },

    { target: '_blank', ext: true, url: 'http://dist.kemsu.ru', title: 'Система управления курсами (Moodle) - Цифровой университет (портал Открытого образования КемГУ)', contact: contacts.instElEdCom },
    { target: '_blank', ext: true, url: 'http://open.kemsu.ru', title: 'Цифровой университет (портал Открытого образования КемГУ)', contact: contacts.instElEdCom },

    { /*target: '_blank',*/ url: getUrlForOldIais("orders/") /*'http://xiais.kemsu.ru/orders/'*/, ext: true, title: 'Заказ справки о доходах для обучающихся очной формы обучения', contact: contacts.cnitSupp },
    { url: '/home/pgas', title: 'Подача заявки на повышенную государственную академическую стипендию (ПГАС)' },
    { url: '/home/anketa-to-bsod', title: 'Анкета для дисциплины' },
    (facultyId === 390 || facultyId == 428 || getUserInfo().id == 1240) && graduateFlag !== 0 ? ({ target: '_blank', url: 'http://ifn.kemsu.ru/?page_id=8771', ext: true, title: 'Анкета выпускника' }) : null
]
