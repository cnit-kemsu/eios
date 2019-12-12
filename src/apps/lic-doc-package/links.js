import { topbarLinks as parentLinks } from '../personal-area/links'

export const topbarLinks = () => [
    ...parentLinks(),
    {url: '/lic-doc-package', title: 'Пакет документов для лицензирования'}
]