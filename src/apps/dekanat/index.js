import * as dekanatPageModule from './DekanatPage'


export async function getAppPage() {
    if (location.pathname === '/dekanat') return dekanatPageModule
    return await import(                          
        `./${location.pathname.split('/').slice(2).join('/')}/index.js`
    )
}

export { default as Layout } from '../../share/layout/Layout'