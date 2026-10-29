import type { Chapter } from "./chapters"
import type { Author } from "./authors"
import { fetchAllPages, fetchOne, fetchPage } from "./api"
import type { QueryParams } from "./query"
import { endpoints } from "./endpoints"

export type Serie = {
    id: number
    title: string
    authors: number[]
    first_published: string
    last_published: string | null
    description: string
    cover: string | null
    genre: string | null
}

export type SerieSingle = Omit<Serie, "authors"> & {
    authors: Author[]
    chapters: Chapter[]
    average_rating: number | null
    count_rating: number
}

export type SerieListParams = QueryParams & {
    limit?: number
    offset?: number
    title?: string
    genre?: string
    ongoing?: boolean
    ordering?: string
}

export function fetchSeriesPage(params: SerieListParams = {}) {
    return fetchPage<Serie>(endpoints.series, params)
}

export async function fetchAllSeries(): Promise<Serie[]> {
    return fetchAllPages<Serie>(endpoints.series)
}

export async function fetchSingleSerie(id: string): Promise<SerieSingle> {
    return fetchOne<SerieSingle>(endpoints.serie(id))
}
