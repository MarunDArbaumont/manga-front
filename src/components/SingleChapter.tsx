import { useEffect, useState } from 'react'
import { fetchSingleChapter } from "../api/chapters"
import ErrorMessage from './ErrorMessage'
import Loading from './Loading'
import type { Chapter } from '../api/chapters'
import dateFormat from '../helper-function/dateFormat'
import ReviewComponent from './Review'
import ReviewForm from './ReviewForm'
import AddToCollection from './AddToCollection'
import { Link } from 'react-router-dom'

function SingleChapter( {id}: { id: string }) {
    const [chapter, setChapter] = useState<Chapter | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [refreshReviews, setRefreshReviews] = useState(0)

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

    const reset = () => {
        setRefreshReviews((n) => n + 1)
    }

    return (
        <>
            <h1>{chapter.name}</h1>
            <p>From <Link to={`/series/${chapter.manga.id}`}>{chapter.manga.title}</Link></p>
            <p>first published: {dateFormat(chapter.first_published)}</p>
            <p>{chapter.count_rating} users' rating: {chapter.average_rating}</p>
            <ReviewForm chapter={chapter} parent={undefined} resetFunc={reset}/>
            <h2>Reviews:</h2>
            <hr />
            <ReviewComponent id={chapter.id.toString()} review_type={"chapter"} refresh={refreshReviews}/>
            <AddToCollection chapter={chapter.id}/>
        </>
    )
}
export default SingleChapter