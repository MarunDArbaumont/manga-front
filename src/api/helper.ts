
export type ResultPagination = {
    count: number,
    next: string,
    previous: string,
    results: any[]
}

export async function helperFetch<T>(url: string): Promise<T> {
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }
        return await response.json() as T
    } catch (error) {
        let message = "Unknown Error"
        if (error instanceof Error) message = error.message
            throw new Error(message)
    }
}
