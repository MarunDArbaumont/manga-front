import API_BASE_URL from "./variables"

export type Chapter = {
    id: number
    number: number;
    name: string;
    first_published: string;
    manga_id: number;
}

export async function fetchAllChapters(): Promise<Chapter[]> {
    const url: string = API_BASE_URL + "chapters"
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }
        const result = await response.json()
        return result.results
    } catch (error) {
        let message = "Unknown Error"
        if (error instanceof Error) message = error.message
        throw new Error(message)
    }
}

export async function fetchSingleChapter(id: string): Promise<Chapter> {
    const url: string = API_BASE_URL + "chapters/" + id + "/"
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

export async function ChaptersByMangaId(id: string): Promise<Chapter[]> {
    const url: string = API_BASE_URL + "chapters?manga=" + id
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }
        const result = await response.json()
        return result.results
    } catch (error) {
        let message = "Unknown Error"
        if (error instanceof Error) message = error.message
        throw new Error(message)
    }
}