import { useEffect, useState } from 'react'
import { fetchSingleSerie } from "../api/series"
import type { SerieSingle } from "../api/series"
import ErrorMessage from './ErrorMessage'
import Loading from './Loading'
import dateFormat from '../helper-function/dateFormat'

function SingleSerie( {id}: { id: string }) {
    const [serie, setSerie] = useState<SerieSingle | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        
        async function load() {
            try {
                const dataSerie = await fetchSingleSerie(id)
                console.log(dataSerie)
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
                        <a href={"/chapters/" + chapter.id}>Number {chapter.number}: {chapter.name}</a>
                    </li>
                ))}
                </ul>
            </div>
        </>
    )
}
export default SingleSerie