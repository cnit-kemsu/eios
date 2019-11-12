export const apiUriPrefix = 'https://api-next.kemsu.ru/api'
export const apiDevUriPrefix = 'https://api-dev.kemsu.ru/api'


async function fetchApiBase(urlPrefix, uri, options = {}, json = true, throwError = false) {

    if (options === null) {
        options = {}
    }

    options.headers = options.headers || {}

    if (json || options.json) {
        options.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...options.headers
        }
    }

    options.headers = {
        ...options.headers,
        'x-access-token': getAccessToken()
    }

    let promise = fetch(`${urlPrefix}/${uri}`, options)

    if (throwError || options.throwError) {
        let response = await promise

        if (!response.ok) {
            if (!options.toJSON) {
                throw response
            } else {
                throw (await response.json())
            }
        }

        if (!options.toJSON) {
            return response
        } else {
            return response.json()
        }
    }

    if (!options.toJSON) {
        return promise
    } else {
        return (await promise).json()
    }
}


/**
 * Обертка вокруг fetch. Автоматически добавляет в заголовок токен (x-access-token). Также, по умолчанию,
 * указываются заголовки Accept и Content-Type со значением application/json. Вы можете
 * указать свои значения
 * @param {String} uri - относительный uri сервиса, идущий после префикса {@link apiUrlPrefix}
 * @param {Object} options - опции как и в fetch + дополнительные свойства, представленные ниже
 * @param {Boolean} [options.json] - использовать JSON в качестве отправляемого и принимаемого типа сообщений. Можно использовать вместо аргумента json
 * @param {Boolean} [options.throwError] - выбрасывать исключение при ошибках 4xx и 5xx. Объектом ошибки будет тот же объект, который возвращается без выброса исключения (ответ от сервера). 
 * Можно использовать вместо аргумента throwError
 * @param {Boolean} [options.toJSON] - если равно true, то вместо объекта Response вернет тело сообщения в формате JSON (тип принимаемого сообщения, соотвественно, должен быть JSON). 
 * По сути, заменяет вызов <i>await response.json()</i>
 * @param {Boolean} [json = true] - использовать JSON в качестве отправляемого и принимаемого типа сообщений
 * @param {Boolean}  [throwError = true] - выбрасывать исключение при ошибках 4xx и 5xx. Объектом ошибки будет тот же объект, который возвращается без выброса исключения (ответ от сервера)
 */
export async function fetchApi(uri, options, json, throwError) {
    return fetchApiBase(apiUriPrefix, uri, options, json, throwError)
}

/**
 * Обертка вокруг fetch для вызова сервисов в режиме разработчика. Автоматически добавляет в заголовок токен (x-access-token). Также, по умолчанию,
 * указываются заголовки Accept и Content-Type со значением application/json. Вы можете
 * указать свои значения
 * @param {String} uri - относительный uri сервиса, идущий после префикса {@link apiUrlPrefix}
 * @param {Object} options - опции как и в fetch + дополнительные свойства, представленные ниже
 * @param {Boolean} [options.json] - использовать JSON в качестве отправляемого и принимаемого типа сообщений. Можно использовать вместо аргумента json
 * @param {Boolean} [options.throwError] - выбрасывать исключение при ошибках 4xx и 5xx. Объектом ошибки будет тот же объект, который возвращается без выброса исключения (ответ от сервера). 
 * Можно использовать вместо аргумента throwError
 * @param {Boolean} [options.toJSON] - если равно true, то вместо объекта Response вернет тело сообщения в формате JSON (тип принимаемого сообщения, соотвественно, должен быть JSON). 
 * По сути, заменяет вызов <i>await response.json()</i>
 * @param {Boolean} [json = true] - использовать JSON в качестве отправляемого и принимаемого типа сообщений
 * @param {Boolean}  [throwError = true] - выбрасывать исключение при ошибках 4xx и 5xx. Объектом ошибки будет тот же объект, который возвращается без выброса исключения (ответ от сервера)
 */
export async function fetchDevApi(uri, options, json, throwError) {
    return fetchApiBase(apiDevUriPrefix, uri, options, json, throwError)
}


