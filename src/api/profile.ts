import { refreshToken, getToken } from "./token"

export type me = {
    id: number
    username: string
}

async function getMe(url: string): Promise<me> {
    let userToken = await getToken()
    if (!userToken.access) {
        throw new Error(`No access token`)
    }
    
    let response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${userToken.access}`
        }
    })
    
    if (!response.ok) {
        if (response.status == 401) {
            const refresh = localStorage.getItem("refresh")
            if (!refresh) {
                throw new Error(`No refresh token`)
            }
            userToken.access = await refreshToken(refresh)
            return getMe(url)
        }
        throw new Error(`Response status: ${response.status}`)
    }
    const result = await response.json()
    return result
}

export default getMe