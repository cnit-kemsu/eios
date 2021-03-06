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
    updateUserInfo,
    userInfoExists,
    userIsStudent
} from './auth'

export { makeAppGenerator, makePageGenerator, performAuthСheck } from './page'

export {
    checkAuthInOldIais,
    getUrlForOldIais,
    redirectToOldIais,
    requestToOldIais,
    syncWithOldIais,
    startSyncWithOldIais
} from './old-iais'


export function toArray(value) {
    if(value instanceof Array) return value
    return [value]
}

export function getFacultyInfo() {
    return JSON.parse(localStorage.getItem('facultyInfo'))
}

export function setFacultyInfo(id, name, isFaculty, isExtramural) {
    localStorage.setItem('facultyInfo', JSON.stringify({
        id: id,
        name: name,
        isFaculty: isFaculty,
        isExtramural: isExtramural
    }))
}