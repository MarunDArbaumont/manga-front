import { useEffect, useState } from 'react'
import { fetchChapterSerie } from "../api/chapters"
import ErrorMessage from './ErrorMessage'
import Loading from './Loading'
import type { Chapter } from '../api/chapters'

function SingleChapter( {id}: { id: string }) {
    const [chapter, setChapter] = useState<Chapter | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        
        async function load() {
            try {
                const data = await fetchChapterSerie(id)
                setChapter(data)
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
    if (!chapter) return <h2>Is null</h2>

    return (
        <>
            <h3>{chapter.name}</h3>
            <p>first published: {chapter.first_published}</p>
        </>
    )
}
export default SingleChapter