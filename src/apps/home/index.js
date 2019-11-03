import * as homePageModule from './HomePage'


export async function getAppPage() {
    if (location.pathname === '/home') return homePageModule
    return await import(`/apps/${location.pathname}/index.dl.js`)
}

export { default as Layout } from '../../share/layout/Layout'
