import { useEffect, useState } from 'react'
import { fetchSingleSerie } from "../api/series"
import type { SerieSingle } from "../api/series"
import ErrorMessage from './ErrorMessage'
import Loading from './Loading'
import dateFormat from '../helper-function/dateFormat'
import { Link } from "react-router-dom"

function SingleSerie( {id}: { id: string }) {
    const [serie, setSerie] = useState<SerieSingle | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        
        async function load() {
            try {
                const dataSerie = await fetchSingleSerie(id)
                setSerie(dataSerie)
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
            {serie.cover ? (
                <img src={serie.cover} className='serie-cover' />
            ): null}
            <p>first published: {dateFormat(serie.first_published)}</p>
            <p>{serie.genre}</p>
            <div>
                <h3>Chapters:</h3>
                <ul>
                {serie.chapters.map((chapter) => (
                    <li key={chapter.id}>
                        <Link to={`/chapters/${chapter.id}`}>Chapter {chapter.number}: {chapter.name}</Link>
                    </li>
                ))}
                </ul>
            </div>
        </>
    )
}
export default SingleSerie