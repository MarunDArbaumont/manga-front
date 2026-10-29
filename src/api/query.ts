export type QueryValue = string | number | boolean | null | undefined

export type QueryParams = Record<string, QueryValue>

/**
 * Adds query parameters while omitting empty values.
 * This keeps callers from having to build URLSearchParams by hand.
 */
export function withQuery(path: string, params: QueryParams = {}): string {
    const query = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return
        query.set(key, String(value))
    })

    const search = query.toString()
    return search ? `${path}?${search}` : path
}
