import { useEffect, useState } from 'react'
import { fetchAllSeries } from "../api/series"
import type { Serie } from "../api/series"
import ErrorMessage from './ErrorMessage'
import Loading from './Loading'
import { Link } from "react-router-dom"

function Series() {
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
        <div className="serie-list">
            {series.map((serie) => (
                <Link 
                onMouseOver={(e) => e.currentTarget.classList.add("hovered")}
                onMouseLeave={(e) => e.currentTarget.classList.remove("hovered")}
                key={serie.id}
                to={`/series/${serie.id}`}
                className="serie-list-item"
                style={{backgroundImage: `url(${serie.cover ?? "/src/assets/img/Pandaman_Oda.jpg"})`}}
                >
                    <h3>{serie.title}</h3>
                </Link>
            ))}
        </div>
  )
}

export default Series