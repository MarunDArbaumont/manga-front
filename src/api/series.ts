import type { Chapter } from "./chapters"
import type { ResultPagination } from "./api"
import type { Author } from "./authors"
import { api } from "./api"

export type Serie = {
    id: number
    title: string
    author: Author[]
    first_published: string
    last_published: string | null
    description: string
    cover: string | null
    genre: string | null
}

export type SerieSingle = Serie & {chapters: Chapter[] | []}

export async function fetchAllSeries(): Promise<Serie[]> {
    const url: string = "/series/"
    const result = await api<ResultPagination>(url)
    return (await result).results
}

export async function fetchSingleSerie(id: string): Promise<SerieSingle> {
    const url: string = "/series/" + id + "/"
    const result = await api<SerieSingle>(url)
    return result
}