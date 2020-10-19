import { contacts } from './contacts'
import { getUrlForOldIais } from 'share/utils'

export const getEmployeeLinks = () => [
    {
        title: 'Образовательные программы:', contact: contacts.webProjCenter, sublinks: [
            { target: '_blank', ext: true, title: 'Реализуемые программы', url: 'https://kemsu.ru/education/educational-programs/', contact: contacts.webProjCenter },
            { title: 'Пакет документов для лицензирования', url: '/home/personal-area/lic-doc-package', contact: contacts.webProjCenter },
            { title: 'Лицензированные новые специальности и направления подготовки', url: '/home/personal-area/new-lic-doc-package', contact: contacts.webProjCenter }
        ]
    },
    { target: '_blank', url: 'https://kemsu.ru/education/schedule/', ext: true, title: 'Расписание занятий/сессий', contact: contacts.webProjCenter },
    { target: '_blank', url: 'http://www.kemsu.ru/', ext: true, title: 'Официальный сайт КемГУ', contact: contacts.webProjCenter },

    { url: '/home/personal-area/rating-for-teachers', /*target: '_blank',*/ title: 'Рейтинг обучающихся (БРС)', contact: contacts.cnitSupp },
    { url: getUrlForOldIais('proc/prep') /*'http://xiais.kemsu.ru/proc/prep/'*/, ext: true, title: 'Информационное обеспечение учебного процесса (ИнфОУПро)', contact: contacts.cnitSupp },
    { target: '_blank', url: 'http://moodle.kemsu.ru/', ext: true, title: 'Cистема управления курсами (Moodle)', contact: contacts.cnitSupp },
    {
        /*target: '_blank',*/ url: 'http://edu.kemsu.ru/res', ext: true, title: 'Депозитарий электронных образовательных ресурсов:', contact: contacts.cnitSupp, sublinks: [
            { /*target: '_blank',*/ url: 'http://edu.kemsu.ru/res/vkr/chgKaf.htm', ext: true, title: 'Занесение ВКР', contact: contacts.cnitSupp },
            { /*target: '_blank',*/ url: 'http://edu.kemsu.ru/res/vkr/index.htm', ext: true, title: 'Поиск ВКР', contact: contacts.cnitSupp }
        ]
    },
    { url: getUrlForOldIais('tests') /*'http://xiais.kemsu.ru/tests/'*/, ext: true, title: 'Система компьютерного адаптивного тестирования (СКАТ)', contact: contacts.cnitSupp },
    { /*target: '_blank',*/ url: 'http://edu.kemsu.ru/res/elem/elem_simple.htm', ext: true, title: 'Информационно-образовательный портал КемГУ', contact: contacts.cnitSupp },
    { /*target: '_blank',*/ url: 'http://conference.kemsu.ru/', ext: true, title: 'Сервер конференций КемГУ', contact: contacts.cnitSupp },
    { target: '_blank', url: 'http://ars.kemsu.ru/', ext: true, title: 'Информационная база показателей деятельности научно-педагогических работников КемГУ (АРС)', contact: contacts.cnitTech },
    { target: '_blank', url: 'http://vc.runnet.ru/start/create.jsp', ext: true, title: 'Сервис веб-конференций RUNNet', contact: contacts.cnitSupp },
    { target: '_blank', url: 'http://kemsu.antiplagiat.ru/', ext: true, title: 'Антиплагиат.ВУЗ', contact: contacts.sciLib },
    { /*target: '_blank',*/ url: 'http://lib.kemsu.ru/pages/default.aspx', ext: true, title: 'Научная библиотека КемГУ', contact: contacts.sciLib },
    {
        title: 'Электронные библиотечные системы:', contact: contacts.sciLib, sublinks: [
            { target: '_blank', url: 'https://biblioclub.ru/index.php?page=main_ub_red', ext: true, title: 'Университетская библиотека онлайн', contact: contacts.sciLib },
            { target: '_blank', url: 'http://e.lanbook.com/', ext: true, title: 'Издательство "Лань"', contact: contacts.sciLib },
            { target: '_blank', url: 'https://biblio-online.ru/', ext: true, title: 'Издательство "ЮРАЙТ"', contact: contacts.sciLib },
            { target: '_blank', url: 'http://www.studentlibrary.ru/', ext: true, title: 'Консультант студента', contact: contacts.sciLib },
            { target: '_blank', url: 'http://znanium.com/', ext: true, title: 'Znanium.com', contact: contacts.sciLib },
            { target: '_blank', url: 'http://www.rosmedlib.ru/', ext: true, title: 'Консультант врача', contact: contacts.sciLib },
            { target: '_blank', url: 'https://academia-library.ru/', ext: true, title: 'ЭБ «Образовательно-издательский центр «Академия»', contact: contacts.sciLib },
            { target: '_blank', url: 'https://elibrary.ru/', ext: true, title: 'ЭБС ELIBRARY.RU «Научная электронная библиотека»', contact: contacts.sciLib },
        ]
    },

    { target: '_blank', ext: true, url: 'http://dist.kemsu.ru', title: 'Система управления курсами (Moodle) - Цифровой университет (портал Открытого образования КемГУ)', contact: contacts.digUn },
    { target: '_blank', ext: true, url: 'http://open.kemsu.ru', title: 'Цифровой университет (портал Открытого образования КемГУ)', contact: contacts.instElEdCom },
    { url: '/workProgram', title: 'Создание рабочих программ дисциплин', contact: contacts.devDep },
]