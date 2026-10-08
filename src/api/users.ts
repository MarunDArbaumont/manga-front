import type { ResultPagination } from "./api"
import type { Chapter } from "./chapters"
import { api } from "./api"

export type Profile = {
    id: number
    user: number
    bio: string
    profile_picture: string
}

export type UserType = {
    id: number
    username: string
    picture: string
}

export type ReviewType = {
    id: number
    user: UserType
    rating: number | null
    description: string
    chapter?: Chapter
    is_edited: boolean
    likes: number
    dislikes: number
    my_reaction: "like" | "dislike" | null
    parent?: number
}

export type NewReview = {
  rating: number | null
  description: string
  chapter?: Chapter
  parent?: number
}

export type EditReview = {
  rating: number | null
  description: string
}

export type SingleProfile = Profile & {mangas: Chapter[] | []}

export type ReactionType = "Like" | "Dislike"

export async function fetchProfileByUserID(userID: string): Promise<SingleProfile> {
    const url: string =  "/users/" + userID + "/profile/"
    const result = await api<SingleProfile>(url)
    return result
}

export async function fetchUserByID(id: string): Promise<UserType> {
    const url: string =  "/users/" + id + "/"
    const result = await api<UserType>(url)
    return result
}

export async function fetchAllUsers(): Promise<UserType[]> {
    const url: string = "/users"
    const result = await api<ResultPagination>(url)
    return (await result).results
}

export async function fetchAllReveiws(): Promise<ReviewType[]> {
    const url: string = "/reviews/"
    const result = await api<ResultPagination>(url)
    return (await result).results
}

export async function fetchReviewsByUser(user_id: string): Promise<ReviewType[]> {
    const url: string = "/reviews/?user=" + user_id
    const result = await api<ResultPagination>(url)
    return (await result).results
}

export async function fetchReviewsChapter(chapter_id: string): Promise<ReviewType[]> {
    const url: string = "/reviews/?chapter=" + chapter_id
    const result = await api<ResultPagination>(url)
    return (await result).results
}

export async function fetchReviewsParent(parent_id: string): Promise<ReviewType[]> {
    const url: string = "/reviews/?parent=" + parent_id
    const result = await api<ResultPagination>(url)
    return (await result).results
}

export const deleteReview = (id: number) => 
    api<ReviewType>(`/reviews/${id}/`, {method: "DELETE"})

export const createReview = (data: NewReview) =>
    api<ReviewType>("/reviews", {method: "POST", body: data})

export const editReview =  (data: EditReview, id: number) =>
    api<ReviewType>(`/reviews/${id}/`, {method: "PATCH", body: data})

export const addToCollection = (data: number) =>
    api<string>("profiles/add_manga/", {method: "POST", body: data})

export const removeToCollection = (data: number) =>
    api<string>("profiles/add_manga/", {method: "DELETE", body: data})

export const updateProfilePicture = (id: number, data: File) => {
    const form = new FormData()
    form.append("profile_picture", data)
    return api<{ data: string}>(`/users/${id}`, {
        method: "PATCH",
        body: form,
    })
}

export const updateProfileBio = (id: number, data: string) =>
    api<string>(`profiles/${id}/`, {method: "PATCH", body: data})

export const reactToReview = (reviewId: number, type: ReactionType) =>
  api<{ message: string }>(
    `/reviews/${reviewId}/${type === "Like" ? "like" : "dislike"}/`,
    { method: "POST" }
  )
export const removeReaction = (reviewId: number) =>
  api<{ message: string }>(`/reviews/${reviewId}/reaction/`, { method: "DELETE" })