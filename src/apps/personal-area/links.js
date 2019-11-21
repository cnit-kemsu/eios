import { userIsStudent } from 'share/utils'

export const topbarLinks = () => [
    { title: 'Главная страница', url: '/' },
    { title: `Личный кабинет ${userIsStudent() ? 'обучающегося' : 'преподавателя'}`, url: '/personal-area' }
]