import { useEffect, useState } from 'react'
import { fetchSingleSerie } from "../api/series"
import type { Serie } from "../api/series"
import ErrorMessage from './ErrorMessage'
import Loading from './Loading'
import { ChaptersByMangaId, type Chapter } from '../api/chapters'

function SingleSerie( {id}: { id: string }) {
    const [serie, setSerie] = useState<Serie | null>(null)
    const [chapters, setChapters] = useState<Chapter[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        
        async function load() {
            try {
                const dataSerie = await fetchSingleSerie(id)
                setSerie(dataSerie)
                const dataChapters = await ChaptersByMangaId(id)
                setChapters(dataChapters)
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
            <div>
                <h3>Chapters:</h3>
                <ul>
                {chapters.map((chapter) => (
                    <li>
                        <a href={"/chapters/" + chapter.id}>Number {chapter.number}: {chapter.name}</a>
                    </li>
                ))}
                </ul>
            </div>
        </>
    )
}
export default SingleSerie