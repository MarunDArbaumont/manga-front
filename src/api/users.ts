import API_BASE_URL from "./variables"

export type Profile = {
    id: number
    user_id: number
    bio: string
    mangas: number[]
}

export type UserType = {
    id: number
    username: string
}

export async function fetchProfileByUserID(userID: string): Promise<Profile> {
    const url: string = API_BASE_URL + "profiles?user=" + userID
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }
        const result = await response.json()
        return result.results[0]
    } catch (error) {
        let message = "Unknown Error"
        if (error instanceof Error) message = error.message
        throw new Error(message)
    }
}

export async function fetchUserByID(id: string): Promise<UserType> {
    const url: string = API_BASE_URL + "users/" + id + "/"
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }
        const result = await response.json()
        return result
    } catch (error) {
        let message = "Unknown Error"
        if (error instanceof Error) message = error.message
        throw new Error(message)
    }
}

export async function fetchAllUsers(): Promise<UserType[]> {
    const url: string = API_BASE_URL + "users"
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }
        const result = await response.json()
        return result
    } catch (error) {
        let message = "Unknown Error"
        if (error instanceof Error) message = error.message
        throw new Error(message)
    }
}