import { useEffect, useState } from 'react'
import { fetchReviewsByUser, fetchReviewsChapter, type ReviewType } from '../api/users'
import ErrorMessage from './ErrorMessage'
import Loading from './Loading'
import { useAuth } from '../hooks/useAuth'
import RemoveReview from './RemoveReview'
import EditReview from './EditReview'

function ReviewComponent( {
        id,
        review_type,
    }: {
        id: string
        review_type: string
    }) {
    const [reviews, setReviews] = useState<ReviewType[]| null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()

    useEffect(() => {
        
        async function load() {
            try {
                if (review_type == "chapter") {
                    const data = await fetchReviewsChapter(id)
                    setReviews(data)
                } else if (review_type == "user") {
                    const data = await fetchReviewsByUser(id)
                    setReviews(data)
                }
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message)
                }
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [id, review_type])

    if (loading) return <Loading message="Loading series..." />
    if (error) return <ErrorMessage message={error} />
    if (!reviews) return <h2>No reviews</h2>
    async function loadReview() {
       if (review_type == "chapter") {
            const data = await fetchReviewsChapter(id)
            setReviews(data)
        } else if (review_type == "user") {
            const data = await fetchReviewsByUser(id)
            setReviews(data)
                }
    }
    const reset = () => {
        loadReview()
    }

    return (
        <>
            <h2>Reviews:</h2>
            <ul>
            {reviews.map((review) => (
                    <li key={review.id} className='single-review'>
                        {review_type == "user" ? (
                            <p>Chapter: <a href={`/chapters/${review.chapter.id}`}>{review.chapter.name}</a></p>
                        ): null }
                        {review_type == "chapter" ? (
                            <p>User: <a href={`/profile/${review.user.id}`}>{review.user.username}</a></p>
                        ): null }
                        <p>Rating: {review.rating}/5</p>
                        <p>{review.description}</p>
                        {user?.id == review.user.id.toString()? (
                            <>
                                <details>
                                    <summary>Edit review</summary>
                                    <EditReview review={
                                        {
                                            id:review.id,
                                            description: review.description,
                                            rating: review.rating.toString()
                                        }
                                        } 
                                        resetFunc={reset}/>
                                </details>
                                <RemoveReview review={review.id} resetFunc={reset}/>
                            </>
                        ): null}
                    </li>
                ))}
            </ul>
        </>
    )
}
export default ReviewComponent