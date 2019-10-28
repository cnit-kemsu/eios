import React, { lazy, useMemo, Suspense } from 'react'
import Page404 from './Page404'

export default function AppRouter({ appName, match }) {

    const App = useMemo(() => lazy(async () => {
        try {
            return await System.import(`/public/apps/${appName}/index.js`)           
        } catch (err) {
            return { default: Page404 }
        }
    }), [appName])    

    return (
        <Suspense fallback={'Загрузка...'}>
            <App appName={appName} match={match} />
        </Suspense>
    )
}