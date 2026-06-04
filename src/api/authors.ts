import API_BASE_URL from "./variables"
import { helperFetch } from "./helper"
import type { ResultPagination } from "./helper"

export type Author = {
    id: number
    name: string
    mangas: number[]
    birth_day: string
    death_date: string | null
    image: string | null
    manga_id: number
}

export async function fetchAllAuthors(): Promise<Author[]> {
    const url: string = API_BASE_URL + "authors?limit=0"
    const result = await helperFetch<ResultPagination>(url)
    return (await result).results
}

export async function fetchSingleAuthor(id: string): Promise<Author> {
    const url: string = API_BASE_URL + "authors/" + id + "/"
    const result = await helperFetch<Author>(url)
    return result
}