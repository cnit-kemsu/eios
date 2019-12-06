import React from 'react'

import { makeAppGenerator } from 'share/utils'


export const appGenerator = makeAppGenerator(() => {

    return (
        <>

        </>
    )

}, { secure: true })

export const layoutProps = {
    footerContactInfo: {
        phone: '(384-2) 58-32-89',
        localPhone: '4-62',
        email: 'ocpo@kemsu.ru'
    }
}

export { default as Layout } from 'share/eios/layout/Layout'
