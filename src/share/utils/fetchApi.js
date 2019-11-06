const apiUriPrefix = 'https://api-next.kemsu.ru/api'

export function fetchApi(uri, options) {
    return fetch(uri[0] === '/' ? apiUriPrefix + uri : apiUriPrefix + '/' + uri, options)
}

