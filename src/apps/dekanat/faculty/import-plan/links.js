import { topbarLinks as parentLinks } from '../links'

export const topbarLinks = () => [
    ...parentLinks(),
    { url: '/dekanat/faculty/import-plan', title: 'Импорт плана' }
]