import { getFacultyInfo } from 'share/utils'

export const topbarLinks = () => [
    { url: "/home", ext: true, title: "Главная страница" },
    { url: "/dekanat", ext: true, title: "Деканат" },
    { url: "/dekanat/faculty", ext: true, title: getFacultyInfo()?.isFaculty ? 'Факультет' : 'Институт'  },
    { url: "http://xiais.kemsu.ru/dekanat/plan/index.htm", ext: true, title: "Учебные планы ФГОС3" },
    { url: "http://xiais.kemsu.ru/dekanat/plan/work/index.htm", ext: true, title: "Рабочий Учебный План" },
    { url: "http://xiais.kemsu.ru/dekanat/plan/work/selworkplan.htm", ext: true, title: "Выбор рабочего УП" },
    { url: '/dekanat/faculty/import-plan', title: 'Импорт плана' }
]