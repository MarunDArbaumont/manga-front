import type { ResultPagination } from "./api"
import { api } from "./api"

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
    const url: string = "/authors/?limit=0"
    const result = await api<ResultPagination>(url)
    return (await result).results
}

export async function fetchSingleAuthor(id: string): Promise<Author> {
    const url: string = "/authors/" + id + "/"
    const result = await api<Author>(url)
    return result
}