import { getFacultyInfo } from 'share/utils'

import { topbarLinks as parentLinks } from '../links'


export const topbarLinks = () => [
    ...parentLinks, 
    { url: '/dekanat/faculty', title: getFacultyInfo()?.isFaculty ? 'Факультет' : 'Институт' }
]