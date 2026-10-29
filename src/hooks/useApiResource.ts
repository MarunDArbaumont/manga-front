import { useCallback, useEffect, useState } from "react"

type UseApiResourceResult<T> = {
    data: T | null
    loading: boolean
    error: unknown | null
    reload: () => void
}

/**
 * Loads a resource and exposes loading/error state plus a reload function.
 * The fetcher must be stable (wrap it in useCallback with its dependencies).
 */
export function useApiResource<T>(fetcher: () => Promise<T>): UseApiResourceResult<T> {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<unknown | null>(null)
    const [version, setVersion] = useState(0)

    useEffect(() => {
        let active = true

        async function load() {
            setLoading(true)
            setError(null)

            try {
                const result = await fetcher()
                if (active) setData(result)
            } catch (err: unknown) {
                if (active) setError(err)
            } finally {
                if (active) setLoading(false)
            }
        }

        void load()

        return () => {
            active = false
        }
    }, [fetcher, version])

    const reload = useCallback(() => {
        setVersion((current) => current + 1)
    }, [])

    return { data, loading, error, reload }
}
