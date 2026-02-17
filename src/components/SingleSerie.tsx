import { useEffect, useState } from 'react'
import { fetchSingleSerie } from "../api/series"
import type { Serie } from "../api/series"
import ErrorMessage from './ErrorMessage'
import Loading from './Loading'

function SingleSerie( {id}: { id: string }) {
    const [serie, setSerie] = useState<Serie | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        
        async function load() {
            try {
                const data = await fetchSingleSerie(id)
                setSerie(data)
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message)
                }
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [id])

    if (loading) return <Loading message="Loading series..." />
    if (error) return <ErrorMessage message={error} />
    if (!serie) return <h2>Is null</h2>

    return (
        <>
            <h3>{serie.title}</h3>
            <p>first published: {serie.first_published}</p>
        </>
    )
}
export default SingleSerie