import React, { useState } from 'react'
import { useRoutes } from '@kemsu/react-routing'

import ErrorBoundary from './core/ErrorBoundary'
import AppRouter from './core/AppRouter'

const routes = {
    '/': '/home',
    '@/([a-zA-Z0-9_-]+)((/([a-zA-Z0-9_-]+))*)': ({ 0: appName }, match, { setError }) => <AppRouter setError={setError} appName={appName} match={match} />
}

export default function Main() {

    const [error, setError] = useState()
    const route = useRoutes(routes, null, { setError })

    return (
        <ErrorBoundary error={error}>
            {route}
        </ErrorBoundary>
    )
}

