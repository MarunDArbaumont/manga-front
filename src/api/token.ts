import type { User } from "../hooks/useUser"
import API_BASE_URL from "./variables"

export type tokenType = {
    access: string | null
    refresh: string | null
}

export type loginInfoType = {
    username: string
    password: string
}

export async function fetchToken(loginInfo: loginInfoType): Promise<tokenType> {
    const response = await fetch(API_BASE_URL + "token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginInfo),
        })
        
    if (!response.ok) {
        throw new Error("Invalid credentials")
    }
    
    const data = await response.json()
    const token: tokenType = {
        access: data.access,
        refresh: data.refresh
    }
    return token
}

export async function fetchUser(loginInfo: loginInfoType): Promise<User> {
    const token = await fetchToken(loginInfo)

    const response = await fetch(API_BASE_URL + "me", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token.access}`
        },
    })

    if (!response.ok) {
        throw new Error("Invalid token")
    }

    const data = await response.json()

    const user: User = {
        id: data.id,
        username: data.username,
        authToken: {
            access: token.access,
            refresh: token.refresh
        }
    }

    return user
}

export async function fectchRefreshToken(refreshTokenValue: string): Promise<any> {
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
    const token: tokenType = {
                access: data.access,
                refresh: refreshTokenValue
            }
    return token
}