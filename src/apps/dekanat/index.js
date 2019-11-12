import * as dekanatPageModule from './DekanatPage'
import { makeAppPageGenerator } from 'share/utils'

export const getAppPage = makeAppPageGenerator('dekanat', dekanatPageModule, {    
    footerContactInfo: {
        phone: '(384-2) 58-32-89, 58-33-41, 58-44-03',
        localPhone: '4-62, 3-46, 4-65',
        email: 'ocpo@kemsu.ru'
    }
})

export { default as Layout } from '../../share/layout/Layout'