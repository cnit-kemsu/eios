const apiUriPrefix = 'https://api-next.kemsu.ru/api'
const apiDevUriPrefix = 'https://api-dev.kemsu.ru/api'


function fetchApiGeneral(url, options = {}) {   
    return fetch(url, options)
}

export function fetchApi(uri, options) {
    return fetchApiGeneral(uri[0] === '/' ? apiUriPrefix + uri : apiUriPrefix + '/' + uri, options);
}

export function fetchDevApi(uri, options) {
    return fetchApiGeneral(uri[0] === '/' ? apiDevUriPrefix + uri : apiDevUriPrefix + '/' + uri, options)
}


