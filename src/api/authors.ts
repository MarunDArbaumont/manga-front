import type { Serie } from "./series"
import { fetchAllPages, fetchOne, fetchPage } from "./api"
import type { QueryParams } from "./query"
import { endpoints } from "./endpoints"

export type Author = {
    id: number
    name: string
    birth_day: string
    death_date: string | null
    image: string | null
    series: Serie[]
}

export type AuthorListParams = QueryParams & {
    limit?: number
    offset?: number
    name?: string
    ordering?: string
}

export function fetchAuthorsPage(params: AuthorListParams = {}) {
    return fetchPage<Author>(endpoints.authors, params)
}

export async function fetchAllAuthors(): Promise<Author[]> {
    return fetchAllPages<Author>(endpoints.authors)
}

export async function fetchSingleAuthor(id: string): Promise<Author> {
    return fetchOne<Author>(endpoints.author(id))
}
