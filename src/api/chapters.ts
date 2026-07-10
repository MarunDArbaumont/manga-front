import API_BASE_URL from "./variables"
import { helperFetch } from "./helper"
import type { ResultPagination } from "./helper"
import type { Serie } from "./series"

export type Chapter = {
    id: number
    number: number
    name: string
    first_published: string
    manga: Serie
    average_rating: number
    count_rating: number
}

export async function fetchAllChapters(): Promise<Chapter[]> {
    const url: string = API_BASE_URL + "chapters/"
    const result = await helperFetch<ResultPagination>(url)
    return (await result).results
}

export async function fetchSingleChapter(id: string): Promise<Chapter> {
    const url: string = API_BASE_URL + "chapters/" + id + "/"
    const result = helperFetch<Chapter>(url)
    return result
}

export async function ChaptersByMangaId(id: string): Promise<Chapter[]> {
    const url: string = API_BASE_URL + "chapters?manga=" + id + "/"
    const result = await helperFetch<ResultPagination>(url)
    return (await result).results
}