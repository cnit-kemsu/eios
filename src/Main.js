import React from 'react'
import { useRoutes } from '@kemsu/react-routing'

import ErrorBoundary from './core/ErrorBoundary'
import AppRouter from './core/AppRouter'

const routes = {
    '/': '/home',
    '/:appName/*': ({ appName }, match) => <AppRouter appName={appName} match={match} />    
}

export default function Main() {

    const route = useRoutes(routes)
    
    return (
        <ErrorBoundary>
            {route}
        </ErrorBoundary>
    )
}

