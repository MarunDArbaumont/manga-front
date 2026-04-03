import API_BASE_URL from "./variables"

export type tokenType = {
    access: string | null
    refresh: string | null
}

export type loginInfoType = {
    username: string
    password: string
}

export async function setToken(loginInfo: loginInfoType) {
    await fetch(API_BASE_URL + "token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginInfo),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Invalid credentials")
            }
            return response.json()
        })
        .then((data) => {
            localStorage.setItem("refresh", data.refresh)
            localStorage.setItem("access", data.access)
        })
        .catch((error) => {
            throw error
        })
}

export async function refreshToken(refreshTokenValue: string) {
    const response = await fetch(API_BASE_URL + "token/refresh/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({refresh: refreshTokenValue})
    })

    if (!response.ok) {
        throw new Error("Invalid refresh token")
    }

    const data = await response.json()
    localStorage.setItem("access", data.access)
    return data.access
}

export async function getToken(): Promise<tokenType>{
    let token: tokenType = {
        access: localStorage.getItem("access"),
        refresh: localStorage.getItem("refresh")
    }
    return token
}

export async function clearToken() {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
}