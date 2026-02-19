import { useEffect, useState } from 'react'
import { fetchAllSeries } from "../api/series"
import type { Serie } from "../api/series"
import ErrorMessage from './ErrorMessage'
import Loading from './Loading'

function AllSeries() {
    const [series, setSeries] = useState<Serie[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            try {
                const data = await fetchAllSeries()
                setSeries(data)
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message)
                }
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    if (loading) return <Loading message="Loading series..." />
    if (error) return <ErrorMessage message={error} />

    return (
        <>
            <h2>Manga series</h2>
            {series.map((serie) => (
                <a key={serie.id} href={"/series/" + serie.id}>
                    <h3>{serie.title}</h3>
                    <p>first published: {serie.first_published}</p>
                </a>
            ))}
        </>
  )
}

export default AllSeries