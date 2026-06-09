import API_BASE_URL from "./variables"
import { helperFetch } from "./helper"
import type { ResultPagination } from "./helper"
import type { Chapter } from "./chapters"

export type Profile = {
    id: number
    user_id: number
    bio: string
}

export type UserType = {
    id: number
    username: string
}

export type SingleProfile = Profile & {mangas: Chapter[] | []}

export async function fetchProfileByUserID(userID: string): Promise<SingleProfile> {
    const url: string = API_BASE_URL + "profiles/" + userID + "/"
    const result = await helperFetch<SingleProfile>(url)
    return result
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