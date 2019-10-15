import React from 'react'
import { useRoutes, Link } from '@kemsu/react-routing'

import ErrorBoundary from './components/ErrorBoundary'
import AppRouter from './components/AppRouter'
import Page404 from './components/Page404'


const routes = {
    '/': '/a/home',
    '/a/:appName/*': ({ appName }, match) => <AppRouter appName={appName} match={match} />
}

export default function App() {    

    const route = useRoutes(routes)

    return (
        <ErrorBoundary>
            <nav>
                <Link to='/a/home'>To Home</Link> |
                <Link to='/a/example'>To Example</Link>
            </nav>
            <hr />
            {route || <Page404 />}
        </ErrorBoundary>
    )
}

