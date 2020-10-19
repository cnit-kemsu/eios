import { topbarLinks as parentLinks } from '../links'

export const topbarLinks = () => [
    ...parentLinks(),
    {url: '/lic-doc-package', title: 'Пакет документов для лицензирования'}
]