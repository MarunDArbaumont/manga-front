import type { Chapter } from "./chapters"
import { api, fetchOne, fetchPage } from "./api"
import type { QueryParams } from "./query"
import { endpoints } from "./endpoints"

export type Profile = {
    id: number
    user: number
    bio: string | null
    profile_picture: string | null
}

export type UserType = {
    id: number
    username: string
    picture: string | null
}

export type BasicUser = Pick<UserType, "id" | "username">

export type ReviewType = {
    id: number
    user: UserType
    rating: number | null
    description: string | null
    chapter?: Chapter | null
    is_edited: boolean
    likes: number
    dislikes: number
    my_reaction: "like" | "dislike" | null
    parent?: number | null
}

export type NewReview = {
  rating: number | null
  description: string
  chapter?: number
  parent?: number
}

export type EditReview = {
  rating: number | null
  description: string
}

export type RegisterData = {
  username: string
  password: string
  email: string
}

export type SingleProfile = Profile & {mangas: Chapter[]}

export type ReactionType = "Like" | "Dislike"

export async function fetchProfileByUserID(userID: string): Promise<SingleProfile> {
    return fetchOne<SingleProfile>(endpoints.profileByUser(userID))
}

export async function fetchUserByID(id: string): Promise<BasicUser> {
    return fetchOne<BasicUser>(endpoints.user(id))
}

export type ReviewListParams = QueryParams & {
  limit?: number
  offset?: number
  user?: string | number
  chapter?: string | number
  parent?: string | number
}

export function fetchReviewsPage(params: ReviewListParams = {}) {
  return fetchPage<ReviewType>(endpoints.reviews, params)
}

export const deleteReview = (id: number) =>
    api<null>(endpoints.review(id), {method: "DELETE"})

export const createReview = (data: NewReview) =>
    api<ReviewType>(endpoints.reviews, {method: "POST", body: data})

export const editReview = (data: EditReview, id: number) =>
    api<ReviewType>(endpoints.review(id), {method: "PATCH", body: data})

export const addToCollection = (chapter: number) =>
    api<{ message: string }>(endpoints.addToCollection, {
        method: "POST",
        body: { chapter },
    })

export const removeToCollection = (chapter: number) =>
    api<{ message: string }>(endpoints.removeFromCollection, {
        method: "DELETE",
        body: { chapter },
    })

export const updateProfilePicture = (id: number, data: File) => {
    const form = new FormData()
    form.append("profile_picture", data)
    return api<Profile>(endpoints.profile(id), {
        method: "PATCH",
        body: form,
    })
}

export const updateProfileBio = (id: number, data: string) =>
    api<Profile>(endpoints.profile(id), {method: "PATCH", body: { bio: data }})

export const registerUser = (data: RegisterData) =>
    api<UserType>(endpoints.users, {
        method: "POST",
        body: data,
        skipAuthHandler: true,
    })

export const reactToReview = (reviewId: number, type: ReactionType) =>
    api<{ message: string }>(
        type === "Like"
            ? endpoints.reviewLike(reviewId)
            : endpoints.reviewDislike(reviewId),
        { method: "POST" }
    )

export const removeReaction = (reviewId: number) =>
    api<{ message: string }>(endpoints.reviewReaction(reviewId), { method: "DELETE" })
