import jwt_decode from 'jwt-decode'
import { HistoryManager } from '@kemsu/react-routing'

import { requestToOldIais } from './old-iais'
import { apiUriPrefix, fetchApi } from './api'

export function userInfoExists() {
    return !!localStorage.getItem('userInfo')
}

export function userIsStudent() {
    const userInfo = getUserInfo()       
    return userInfo?.userType === 'обучающийся'
}


export function getAccessToken() {
    return localStorage.getItem('accessToken')
}

export function getAccessTokenExpDate() {
    const accessToken = getAccessToken()
    let decode = jwt_decode(accessToken)
    return (new Date(decode.exp * 1000))
}

export function getUserInfo() {
    let userInfo = localStorage.getItem('userInfo')
    return userInfo && JSON.parse(userInfo)
}

export function getUserFullName() {
    const userInfo = getUserInfo()

    if (userInfo) {
        return `${userInfo.lastName} ${userInfo.firstName && (userInfo.firstName[0] + '.')} ${userInfo.middleName && (userInfo.middleName[0] + '.')}`
    }
}

export function isAccessTokenValid() {

    const accessToken = getAccessToken()

    if (accessToken) {
        let decode = jwt_decode(accessToken)
        return (new Date(decode.exp * 1000)) > Date.now()
    }

    return false
}

function AuthError(status, message) {
    this.status = status
    this.message = message
}

export function logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('facultyInfo')
    document.cookie = `accessToken=; path=/; domain=.kemsu.ru; expires=${(new Date(0)).toUTCString()}`

    requestToOldIais('restricted/logoff.htm', null, () => {

        if (location.pathname == '/home') location.reload()
        else {
            HistoryManager.push('/home')
        }
    }, true)
}

export async function auth(login, password, accessTokenLifetime) {

    let response = await fetch(`${apiUriPrefix}/auth`, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            login: login,
            password: password,
            lifetime: accessTokenLifetime
        })
    })

    let result = await response.json()

    if (!response.ok) {
        throw new AuthError(response.status, result.message)
    }

    let decode = jwt_decode(result.accessToken)

    localStorage.setItem('accessToken', result.accessToken)
    localStorage.setItem('userInfo', JSON.stringify(await addFacultyData(result.userInfo)))
    document.cookie = `accessToken=${result.accessToken}; path=/; domain=.kemsu.ru; expires=${(new Date(decode.exp * 1000)).toUTCString()}`
}

export function generateAuthUrlFor(url) {
    return `/home?backUrl=${encodeURI(url || location.pathname)}`
}

export async function checkAccessTo(secure) {

    let userInfo = getUserInfo()

    if (!userInfo || !isAccessTokenValid()) {
        return false
    }

    let result = await fetchApi('check-access-to', {
        method: 'POST',
        body: JSON.stringify({
            userId: userInfo.id,
            secure: secure
        })
    })

    return result.ok
}

async function addFacultyData(userInfo) {

    /*if (userInfo.userType === 'обучающийся') {        

        let response = await fetchApi('dekanat/students/faculties/current', {
            method: "get",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })        

        if (response.ok) {
            let res = await response.json()            

            userInfo.facultyId = res.facultyId
            userInfo.facultyName = res.facultyName
            userInfo.facultyShortName = res.facultyShortName
        } else {
            console.error((await response.json()).stack)
        }

    } else if (userInfo.userType === 'сотрудник') {
        let response = await fetchApi('security/users/teachers/current-department', {
            method: "get",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })        

        if (response.ok) {
            let res = await response.json()            
            
            userInfo.facultyName = res.facultyName
            userInfo.facultyShortName = res.facultyShortName
            userInfo.cathedraName = res.cathedraName
            
        } else {
            console.error((await response.json()).stack)
        }
    }*/

    return userInfo
}

export async function updateUserInfo() {
    let response = await fetchApi('security/users')

    localStorage.setItem('userInfo', JSON.stringify(await addFacultyData(await response.json())))
}