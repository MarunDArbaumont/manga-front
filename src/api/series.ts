import API_BASE_URL from "./variables"
import type { Chapter } from "./chapters"
import { helperFetch } from "./helper"
import type { ResultPagination } from "./helper"

export type Serie = {
    id: number
    title: string
    author: number[]
    first_published: string
    last_published: string | null
    description: string
    cover: string | null
    genre: string | null
}

export type SerieSingle = Serie & {chapters: Chapter[] | []}

export async function fetchAllSeries(): Promise<Serie[]> {
    const url: string = API_BASE_URL + "series"
    const result = await helperFetch<ResultPagination>(url)
    return (await result).results
}

export async function fetchSingleSerie(id: string): Promise<SerieSingle> {
    const url: string = API_BASE_URL + "series/" + id + "/"
    const result = await helperFetch<SerieSingle>(url)
    return result
}