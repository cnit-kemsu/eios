import React from 'react'

import { useAuth, Auth } from 'share/eios/Auth'


export function App() {

    console.log('ExampleApp')

    const auth = useAuth({ secure: true })

    return (
        <Auth {...auth} redirect>
            <div>TODO: Add examples</div>
        </Auth>
    )
}