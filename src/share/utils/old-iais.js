

export function getUrlForOldIais(path, search, https) {

    search = search ? { ...search, backToNewEios: location.toString() } : { backToNewEios: location.toString() }

    let searchStr = Object.keys(search).map(key => search[key] ? `${key}=${search[key]}` : key).join('&')
    return `${https ? 'https' : 'http'}://niais2.kemsu.ru/${path}?${searchStr}`
}

export function requestToOldIais(url, search, onLoad, https) {

    let iframe = document.createElement('iframe')

    iframe.name = Date.now()
    iframe.src = getUrlForOldIais(url, search, https)
    iframe.style.display = 'none'

    if (onLoad) {
        iframe.addEventListener('load', () => {
            onLoad && onLoad()
            iframe.parentNode.removeChild(iframe)
        })
    }

    document.body.appendChild(iframe)
}

export function redirectToOldIais(url, search, https) {    
    window.open(getUrlForOldIais(url, search, https), '_blank')
}

export function checkAuthInOldIais() {

    return new Promise((resolve) => {
        let iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        iframe.name = Date.now()
        iframe.src = 'https://niais2.kemsu.ru/dekanat/eios-next-sync/check-auth.htm'
        document.body.appendChild(iframe)

        let handler = e => {            
            resolve(e.data)
            iframe.parentNode.removeChild(iframe)
            window.removeEventListener('message', handler)
        }

        window.addEventListener("message", handler, false)

        iframe.addEventListener("load", () => {
            iframe.contentWindow.postMessage(null, "*")
        })
    })
}

export function syncWithOldIais(htmFileName) {

    return new Promise((resolve) => {
        let iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        iframe.name = Date.now()
        iframe.src = `https://niais2.kemsu.ru/dekanat/eios-next-sync/${htmFileName}.htm`
        document.body.appendChild(iframe)

        let handler = e => {
            resolve(e.data)
            iframe.parentNode.removeChild(iframe)
            window.removeEventListener('message', handler)
        }

        window.addEventListener("message", handler, false)

        iframe.addEventListener("load", () => {
            iframe.contentWindow.postMessage(null, "*")
        })
    })
}