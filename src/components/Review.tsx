import { useEffect, useState } from 'react'
import { fetchReviewsByUser, fetchReviewsChapter, fetchReviewsParent, type ReviewType } from '../api/users'
import ErrorMessage from './ErrorMessage'
import Loading from './Loading'
import { useAuth } from '../hooks/useAuth'
import RemoveReview from './RemoveReview'
import EditReview from './EditReview'
import Reaction from './Reaction'
import ReviewForm from './ReviewForm'
import { Link } from "react-router-dom"
import { MEDIA_BASE_URL } from '../api/variables'

type Props = {
    id: string
    review_type: string
    refresh?: number
}

function ReviewComponent({id, review_type, refresh}: Props) {
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
                } else if (review_type == "children") {
                    const data = await fetchReviewsParent(id)
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
    }, [id, review_type, refresh])

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
        } else if (review_type == "children") {
            const data = await fetchReviewsParent(id)
            setReviews(data)
        }
    }
    const reset = () => {
        loadReview()
    }

    return (
        <>
            <ul>
            {reviews.map((review) => 
                review_type == "user" && review.chapter == undefined? null: (
                    <>
                    <li key={review.id} className='single-review'>
                        {review_type == "children" ? (
                            <p>Response to the above</p>
                        ): null }
                        {review_type == "user" ? (
                            <p>Chapter: <Link to={`/chapters/${review.chapter?.id}`}>{review.chapter?.name}</Link></p>
                        ): null }
                            <Link to={`/profile/${review.user.id}`} className="review-user">
                                <img src={MEDIA_BASE_URL + review.user.picture.slice(1)}/>
                                {review.user.username}
                            </Link>
                        {review_type != "children"? (
                            <p>Rating: {review.rating}/5</p>
                        ): null}
                        <p>{review.description}</p>
                        <div className="reaction">
                            <div className="like-div">
                                <p>{review.likes}</p>
                                <Reaction review={review.id} resetFunc={reset} type="Like"/>
                            </div>
                            <div className="dislike-div">
                                <p>{review.dislikes}</p>
                                <Reaction review={review.id} resetFunc={reset} type="Dislike"/>
                            </div>
                        </div>
                        {review.is_edited? (
                            <p>[Edited]</p>
                        ): null}
                        {user?.id == review.user.id.toString()?(
                            <>
                                <details>
                                    <summary>Edit review</summary>
                                    <EditReview review={
                                        {
                                            id:review.id,
                                            description: review.description,
                                            rating: review.rating?.toString() ?? "",
                                        }
                                        } 
                                        resetFunc={reset}/>
                                </details>
                                <RemoveReview review={review.id} resetFunc={reset}/>
                            </>
                        ): null}
                        <ReviewForm chapter={undefined} parent={review.id.toString()} resetFunc={reset} />
                        <hr />
                        <ReviewComponent id={review.id.toString()} review_type="children" />
                    </li>
                    </>
            )
                )}
            </ul>
        </>
    )
}
export default ReviewComponent