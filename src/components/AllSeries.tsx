import { useEffect, useState } from 'react'
import { fetchAllSeries } from "../api/series"
import type { Serie } from "../api/series"

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

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <>
            <h2>Manga series</h2>
            {series.map((serie) => (
                <div key={serie.id}>
                <h3>{serie.title}</h3>
                <p>first published: {serie.first_published}</p>
                </div>
            ))}
        </>
  )
}

export default AllSeries