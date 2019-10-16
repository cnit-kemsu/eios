import React, { lazy, useMemo, Suspense } from 'react'

export default function AppRouter({ appName, match }) {    

    const App = useMemo(() => lazy(() => System.import(`/public/apps/${appName}/index.js`)), [appName])

    return (
        <Suspense fallback={'Загрузка...'}>
            <App appName={appName} match={match} />
        </Suspense>        
    )
}