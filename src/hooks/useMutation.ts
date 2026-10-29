import { useCallback, useState } from "react"

export type MutationResult<T> =
    | { ok: true; data: T }
    | { ok: false; error: unknown }

type UseMutationResult<TArgs extends unknown[], TResult> = {
    mutate: (...args: TArgs) => Promise<MutationResult<TResult>>
    pending: boolean
    error: unknown | null
    resetError: () => void
}

/**
 * Wraps a mutation with pending/error state.
 * Callers get a discriminated result so they can run success logic only when
 * the request actually succeeded.
 */
export function useMutation<TArgs extends unknown[], TResult>(
    mutationFn: (...args: TArgs) => Promise<TResult>
): UseMutationResult<TArgs, TResult> {
    const [pending, setPending] = useState(false)
    const [error, setError] = useState<unknown | null>(null)

    const mutate = useCallback(
        async (...args: TArgs): Promise<MutationResult<TResult>> => {
            setPending(true)
            setError(null)

            try {
                const data = await mutationFn(...args)
                return { ok: true, data }
            } catch (err: unknown) {
                setError(err)
                return { ok: false, error: err }
            } finally {
                setPending(false)
            }
        },
        [mutationFn]
    )

    const resetError = useCallback(() => setError(null), [])

    return { mutate, pending, error, resetError }
}
