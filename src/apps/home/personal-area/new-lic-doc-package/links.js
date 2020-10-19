import { topbarLinks as parentLinks } from '../links'

export const topbarLinks = () => [
    ...parentLinks(),
    {url: '/home/personal-area/new-lic-doc-package', title: 'Лицензированные новые специальности и направления подготовки'}
]