import API_BASE_URL from "./variables"
import { helperFetch } from "./helper"
import type { ResultPagination } from "./helper"

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
    const result = await helperFetch<ResultPagination>(url)
    return (await result).results[0]
}

export async function fetchUserByID(id: string): Promise<UserType> {
    const url: string = API_BASE_URL + "users/" + id + "/"
    const result = await helperFetch<UserType>(url)
    return result
}

export async function fetchAllUsers(): Promise<UserType[]> {
    const url: string = API_BASE_URL + "users"
    const result = await helperFetch<ResultPagination>(url)
    return (await result).results
}