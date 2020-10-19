import { getFacultyInfo } from 'share/utils'

export const topbarLinks = () => [
    { url: "/home", title: "Главная страница" },
    { url: "/dekanat", title: "Деканат" },
    { url: "/dekanat/faculty", title: getFacultyInfo()?.isFaculty ? 'Факультет' : 'Институт'  },
    { url: "http://xiais.kemsu.ru/dekanat/sess/index.htm", title:  "Сессия"},
    { url: '/dekanat/faculty/sess-report', title: 'Отчет по итогам сессий' }
]