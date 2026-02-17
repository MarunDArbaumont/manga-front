import API_BASE_URL from "./variables"

export type Serie = {
    id: number;
    title: string;
    first_published: string;
    last_published: string | null;
    description: string;
    cover: string | null;
    genre: string | null;
}

export async function fetchAllSeries(): Promise<Serie[]> {
    const url: string = API_BASE_URL + "series"
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

export async function fetchSingleSerie(id: string): Promise<Serie> {
    console.log("INSIDE fetchSingleSerie", id)
    const url: string = API_BASE_URL + "series/" + id + "/"
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