import { topbarLinks as parentLinks } from '../links'

export const topbarLinks = () => [
    ...parentLinks(),
    {url: '/home/personal-area/rating-for-teachers', title: 'Рейтинг обучающихся (БРС)'}
]