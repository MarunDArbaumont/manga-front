import { useEffect, useState } from 'react'
import { fetchSingleAuthor, type Author } from "../api/authors"
import { fetchSingleSerie, type Serie } from "../api/series"
import ErrorMessage from './ErrorMessage'
import Loading from './Loading'
import dateFormat from "./../helper-function/dateFormat"

function SingleAuthor( {id}: { id: string }) {
    const [author, setAuthor] = useState<Author | null>(null)
    const [series, setSeries] = useState<Serie[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        
        async function load() {
            try {
                const data = await fetchSingleAuthor(id)
                setAuthor(data)
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

    useEffect(() => {

    async function loadSeries() {
        if (!author) return
        const results = await Promise.all(
            author.mangas.map((id) => fetchSingleSerie(id.toString()))
        )
        setSeries(results)
    }

    loadSeries()
}, [author])

    if (loading) return <Loading message="Loading series..." />
    if (error) return <ErrorMessage message={error} />
    if (!author) return <h2>Is null</h2>

    return (
        <>
            <h2>{author.name}</h2>
            <p>born on: {dateFormat(author.birth_day)}</p>
            {typeof author.death_date == "string" ? (
                <p>death date: {dateFormat(author.death_date)}</p>
            ): null}
            <h3>Mangas:</h3>
            <ul>
                {series.map((serie) => (
                    <li><a key={serie.id} href={"/series/" + serie.id}>{serie.title}</a></li>
                ))}
            </ul>
        </>
    )
}
export default SingleAuthor