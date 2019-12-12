import { hot } from 'react-hot-loader/root'

import React, { useState } from 'react'
import { useRoutes } from '@kemsu/react-routing'

import ErrorBoundary from './core/ErrorBoundary'
import AppRouter from './core/AppRouter'

import { startSyncWithOldIais } from './share/utils/old-iais'

const routes = {
    '/': '/home',
    '@/([a-zA-Z0-9_-]+)((/([a-zA-Z0-9_-]+))*)': ({ 0: appName }, match, { setError }) => <AppRouter setError={setError} appName={appName} match={match} />
}

startSyncWithOldIais()

export default hot(function Main() {

    const [error, setError] = useState()
    const route = useRoutes(routes, null, { setError })    

    return (
        <ErrorBoundary error={error}>
            {route}
        </ErrorBoundary>
    )
})

