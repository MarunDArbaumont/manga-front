import API_BASE_URL from "./variables"

export type Author = {
    id: number
    name: string;
    mangas: number[]
    birth_day: string;
    death_date: string | null;
    manga_id: number;
}

export async function fetchAllAuthors(): Promise<Author[]> {
    const url: string = API_BASE_URL + "authors"
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }
        const result = await response.json()
        return result
    } catch (error) {
        let message = "Unknown Error"
        if (error instanceof Error) message = error.message
        throw new Error(message)
    }
}

export async function fetchSingleAuthor(id: string): Promise<Author> {
    const url: string = API_BASE_URL + "authors/" + id + "/"
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }
        const result = await response.json()
        return result
    } catch (error) {
        let message = "Unknown Error"
        if (error instanceof Error) message = error.message
        throw new Error(message)
    }
}