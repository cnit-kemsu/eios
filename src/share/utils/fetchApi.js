const apiUriPrefix = 'https://api-next.kemsu.ru/api'
const apiDevUriPrefix = 'https://api-dev.kemsu.ru/api'


export function fetchApi(uri, options) {
    return fetch(uri[0] === '/' ? apiUriPrefix + uri : apiUriPrefix + '/' + uri, options)
}

export function fetchDevApi(uri, options) {
    return fetch(uri[0] === '/' ? apiDevUriPrefix + uri : apiDevUriPrefix + '/' + uri, options)
}


