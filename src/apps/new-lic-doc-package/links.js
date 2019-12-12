import { topbarLinks as parentLinks } from '../personal-area/links'

export const topbarLinks = () => [
    ...parentLinks(),
    {url: '/new-lic-doc-package', title: 'Лицензированные новые специальности и направления подготовки'}
]