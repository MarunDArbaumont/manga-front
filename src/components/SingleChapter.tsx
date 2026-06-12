import { useEffect, useState } from 'react'
import { fetchSingleChapter } from "../api/chapters"
import ErrorMessage from './ErrorMessage'
import Loading from './Loading'
import type { Chapter } from '../api/chapters'
import dateFormat from '../helper-function/dateFormat'
import ReviewComponent from './Review'

function SingleChapter( {id}: { id: string }) {
    const [chapter, setChapter] = useState<Chapter | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        
        async function load() {
            try {
                const data = await fetchSingleChapter(id)
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
            <h1>{chapter.name}</h1>
            <p>first published: {dateFormat(chapter.first_published)}</p>
            <ReviewComponent id={chapter.id.toString()} review_type={"chapter"} />
        </>
    )
}
export default SingleChapter