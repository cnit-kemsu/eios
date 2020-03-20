
import { logout, getUserInfo, isAccessTokenValid } from './auth'

// Для синхронизации с авторизацией в iais + проверка истечения токена
export async function checkAuth() {

    let auth = await checkAuthInOldIais()

    if (getUserInfo() && (!isAccessTokenValid() || !auth || (+auth) === -1)) {
        logout()
        location.reload()
    }
}

// Для запуска синхронизации с авторизацией в iais
export function startSyncWithOldIais() {
    setInterval(() => {
        checkAuth()
    }, 90000)
}

export function getUrlForOldIais(path, search, https, server = 'xiais') {

    search = search ? { ...search, backToNewEios: location.toString() } : { backToNewEios: location.toString() }

    let searchStr = Object.keys(search).map(key => search[key] ? `${key}=${search[key]}` : key).join('&')
    return `${https ? 'https' : 'http'}://${server}.kemsu.ru/${path}?${searchStr}`
}

export function requestToOldIais(url, search, https, server = 'xiais') {

    return new Promise((resolve, reject) => {

        let iframe = document.createElement('iframe')

        iframe.name = Date.now()
        iframe.src = getUrlForOldIais(url, search, https, server)
        iframe.style.display = 'none'

        iframe.addEventListener('load', () => {
            resolve()
            iframe.parentNode.removeChild(iframe)
        })

        iframe.addEventListener('error', (err) => {
            reject(err)
            iframe.parentNode.removeChild(iframe)
        })

        document.body.appendChild(iframe)

    })
}

export function redirectToOldIais(url, search, https) {
    window.open(getUrlForOldIais(url, search, https), '_blank')
}

export function checkAuthInOldIais() {

    return new Promise((resolve, reject) => {
        let iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        iframe.name = Date.now()
        iframe.src = 'https://xiais.kemsu.ru/dekanat/eios-next-sync/check-auth.htm'

        let handler = e => {
            resolve(e.data)
            iframe.parentNode.removeChild(iframe)
            window.removeEventListener('message', handler)
        }

        window.addEventListener("message", handler, false)

        iframe.addEventListener("load", () => {
            iframe.contentWindow.postMessage(null, "*")
        })

        iframe.addEventListener('error', (err) => {
            reject(err)
            iframe.parentNode.removeChild(iframe)
        })

        document.body.appendChild(iframe)
    })
}

export function syncWithOldIais(htmFileName) {

    return new Promise((resolve, reject) => {

        let iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        iframe.name = Date.now()
        iframe.src = `https://xiais.kemsu.ru/dekanat/eios-next-sync/${htmFileName}.htm`

        let handler = e => {
            resolve(e.data)
            iframe.parentNode.removeChild(iframe)
            window.removeEventListener('message', handler)
        }

        window.addEventListener("message", handler, false)

        iframe.addEventListener("load", () => {
            iframe.contentWindow.postMessage(null, "*")
        })

        iframe.addEventListener('error', (err) => {
            reject(err)
            iframe.parentNode.removeChild(iframe)
        })

        document.body.appendChild(iframe)
    })
}