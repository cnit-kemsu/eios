import React from 'react'

import * as dekanatPageModule from './DekanatPage'
import { makeAppPageGenerator } from 'share/utils'

export const getAppPage = makeAppPageGenerator('dekanat', dekanatPageModule, {
    layoutProps: {
        footerContactInfo: {
            phone: '(384-2) 58-32-89, 58-33-41, 58-44-03',
            localPhone: '4-62, 3-46, 4-65',
            email: 'ocpo@kemsu.ru'
        },
    },
    funcLayoutProps: {
        topbarAdditionalInfo: () => (
            <div style={{ marginRight: '28px' }}>
                <div style={{ textDecoration: 'none', fontSize: '13.6px'}}>TODO: выводить факультет</div>
            </div>
        )
    }

})

export { default as Layout } from '../../share/layout/Layout'