import type { Serie } from "./series"
import { fetchAllPages, fetchOne, fetchPage } from "./api"
import type { QueryParams } from "./query"
import { endpoints } from "./endpoints"

export type Chapter = {
    id: number
    number: number
    name: string
    first_published: string
    manga: Serie
    average_rating: number | null
    count_rating: number
}

export type ChapterListParams = QueryParams & {
    limit?: number
    offset?: number
    manga?: string | number
    number?: number
    ordering?: string
}

export function fetchChaptersPage(params: ChapterListParams = {}) {
    return fetchPage<Chapter>(endpoints.chapters, params)
}

export async function fetchAllChapters(): Promise<Chapter[]> {
    return fetchAllPages<Chapter>(endpoints.chapters)
}

export async function fetchSingleChapter(id: string): Promise<Chapter> {
    return fetchOne<Chapter>(endpoints.chapter(id))
}

export async function fetchChaptersByMangaId(id: string): Promise<Chapter[]> {
    return fetchAllPages<Chapter>(endpoints.chapters, { manga: id })
}
