export { fetchApi, fetchDevApi } from './api'
export {
    auth,
    checkAccessTo,
    generateAuthUrlFor,
    getAccessToken,
    getAccessTokenExpDate,
    getUserFullName,
    getUserInfo,
    isAccessTokenValid,
    logout,
    updateUserInfo
} from './auth'

export function toArray(value) {
    if(value instanceof Array) return value
    return [value]
}

export { makeAppPageGenerator } from './page'

export {
    checkAuthInOldIais,
    getUrlForOldIais,
    redirectToOldIais,
    requestToOldIais,
    syncWithOldIais
} from './old-iais'