import * as dekanatPageModule from './DekanatPage'


export async function getAppPage() {
    if (location.pathname === '/dekanat') return dekanatPageModule
    return await import(`/apps/${location.pathname}/index.dl.js`)
}

export { default as Layout } from '../../share/layout/Layout'