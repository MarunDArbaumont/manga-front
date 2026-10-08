import type { ResultPagination } from "./api"
import type { Serie } from "./series"
import { api } from "./api"

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
    const url: string = "/chapters/"
    const result = await api<ResultPagination>(url)
    return (await result).results
}

export async function fetchSingleChapter(id: string): Promise<Chapter> {
    const url: string = "/chapters/" + id + "/"
    const result = api<Chapter>(url)
    return result
}

export async function ChaptersByMangaId(id: string): Promise<Chapter[]> {
    const url: string = "/chapters?manga=" + id + "/"
    const result = await api<ResultPagination>(url)
    return (await result).results
}