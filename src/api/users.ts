import API_BASE_URL from "./variables"
import { helperFetch } from "./helper"
import type { ResultPagination } from "./helper"
import type { Chapter } from "./chapters"

export type Profile = {
    id: number
    user: number
    bio: string
}

export type UserType = {
    id: number
    username: string
}

export type ReviewType = {
    id: number
    user: number
    rating: number
    description: string
    chapter: number
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

export async function fetchAllReveiws(): Promise<ReviewType[]> {
    const url: string = API_BASE_URL + "reviews"
    const result = await helperFetch<ResultPagination>(url)
    return (await result).results
}

export async function fetchReviewsByUser(user_id: string): Promise<ReviewType[]> {
    const url: string = API_BASE_URL + "reviews?user=" + user_id
    const result = await helperFetch<ResultPagination>(url)
    return (await result).results
}

export async function fetchReviewsChapter(chapter_id: string): Promise<ReviewType[]> {
    const url: string = API_BASE_URL + "reviews?chapter=" + chapter_id
    const result = await helperFetch<ResultPagination>(url)
    return (await result).results
}