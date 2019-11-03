import * as homePageModule from './HomePage'


export async function getAppPage() {
    if (location.pathname === '/home') return homePageModule
    return await import(`./${location.pathname.split('/').slice(2).join('/')}/index.js`)
}

export { default as Layout } from '../../share/layout/Layout'
