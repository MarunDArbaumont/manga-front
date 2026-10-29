import { useCallback, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { fetchSingleChapter } from "../api/chapters"
import { getApiErrorMessage } from '../api/api'
import { mediaUrl } from '../api/variables'
import { useAuth } from '../context/useAuth'
import { useApiResource } from '../hooks/useApiResource'
import dateFormat from '../helper-function/dateFormat'
import formatRating from '../helper-function/formatRating'
import defaultCover from '../assets/img/Pandaman_Oda.jpg'
import type { Chapter } from '../api/chapters'
import AddToCollection from './AddToCollection'
import ErrorMessage from './ErrorMessage'
import Loading from './Loading'
import ReviewComponent from './Review'
import ReviewForm from './ReviewForm'

function SingleChapter( {id}: { id: string }) {
    const [refreshReviews, setRefreshReviews] = useState(0)
    const { user } = useAuth()
    const location = useLocation()

    const loadChapter = useCallback(() => fetchSingleChapter(id), [id])
    const { data: chapter, error, loading } = useApiResource<Chapter>(loadChapter)

    if (loading) return <Loading message="Loading chapter..." />
    if (error) return <ErrorMessage message={getApiErrorMessage(error, { fallback: "Failed to load this chapter." })} />
    if (!chapter) return <h2>This chapter doesn't exist</h2>

    const reset = () => {
        setRefreshReviews((n) => n + 1)
    }

    return (
        <>
            <div className="chapter-detail-header">
                <img
                    src={mediaUrl(chapter.manga.cover, defaultCover)}
                    alt={`Cover of ${chapter.manga.title}`}
                    className="chapter-serie-cover"
                />
                <div>
                    <h1>Chapter {chapter.number}: {chapter.name}</h1>
                    <p>
                        From{" "}
                        <Link to={`/series/${chapter.manga.id}`}>
                            {chapter.manga.title}
                        </Link>
                    </p>
                    <p>Published: {dateFormat(chapter.first_published)}</p>
                    <p>Rating: {formatRating(chapter.average_rating, chapter.count_rating)}</p>
                    {chapter.manga.genre ? <p>Genre: {chapter.manga.genre}</p> : null}
                </div>
            </div>

            {user ? (
                <AddToCollection chapter={chapter.id}/>
            ) : (
                <p className="login-prompt">
                    <Link to="/login" state={{ from: location }}>Log in</Link> to add this chapter to your collection.
                </p>
            )}

            {user ? (
                <ReviewForm chapter={chapter} parent={undefined} resetFunc={reset}/>
            ) : (
                <p className="login-prompt">
                    <Link to="/login" state={{ from: location }}>Log in</Link> to write a review.
                </p>
            )}

            <h2>Reviews</h2>
            <hr />
            <ReviewComponent key={`${chapter.id}-${refreshReviews}`} id={chapter.id.toString()} review_type={"chapter"}/>
        </>
    )
}
export default SingleChapter
