import React, { lazy } from 'react'

export function makeAppRoutes(appName, DefaultPageComponent) {
    return {
        [`@/${appName}((?:/[a-zA-Z0-9-]+)+)`]: (params, match, props) => React.createElement(lazy(() => import(`/public/apps/${appName}${params[0]}/index.js`)), props),
        '/*': (params, match, props) => <DefaultPageComponent {...props} />
    }
}