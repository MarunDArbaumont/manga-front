import { useEffect, useState } from 'react'
import { fetchReviewsByUser, fetchReviewsChapter, type ReviewType } from '../api/users'
import ErrorMessage from './ErrorMessage'
import Loading from './Loading'

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

    return (
        <>
            <h3>Reviews:</h3>
            {reviews.map((review) => (
                    <li key={review.id}>
                        {review_type == "user" ? (
                            <p>Chapter: {review.chapter}</p>
                        ): null }
                        {review_type == "chapter" ? (
                            <p>User: <a href={`/profile/${review.user}`}>{review.user}</a></p>
                        ): null }
                        <p>Rating: {review.rating}/5</p>
                    </li>
                ))}
        </>
    )
}
export default ReviewComponent