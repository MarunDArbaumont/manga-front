import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  fetchReviewsByUser,
  fetchReviewsChapter,
  fetchReviewsParent,
  type ReviewType,
} from "../api/users"
import ErrorMessage from "./ErrorMessage"
import Loading from "./Loading"
import { useAuth } from "../context/AuthContext"
import RemoveReview from "./RemoveReview"
import EditReview from "./EditReview"
import Reaction from "./Reaction"
import ReviewForm from "./ReviewForm"

type Props = {
  id: string
  review_type: "chapter" | "user" | "children"
  refresh?: number
}

function ReviewComponent({ id, review_type, refresh }: Props) {
  const [reviews, setReviews] = useState<ReviewType[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const userId = user?.id

  const loadReviews = useCallback(async () => {
    try {
      setError(null)
      if (review_type === "chapter") {
        setReviews(await fetchReviewsChapter(id))
      } else if (review_type === "user") {
        setReviews(await fetchReviewsByUser(id))
      } else {
        setReviews(await fetchReviewsParent(id))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reviews")
    } finally {
      setLoading(false)
    }
  }, [id, review_type, userId])

  useEffect(() => {
    void loadReviews()
  }, [loadReviews, refresh])

  if (loading) return <Loading message="Loading reviews..." />
  if (error) return <ErrorMessage message={error} />
  if (!reviews || reviews.length === 0) return <h2>No reviews</h2>

  const visible =
    review_type === "user" ? reviews.filter((r) => r.chapter) : reviews

  return (
    <ul>
      {visible.map((review) => (
        <li key={review.id} className="single-review">
          {review_type === "children" && <p>Response to the above</p>}

          {review_type === "user" && (
            <p>
              Chapter:{" "}
              <Link to={`/chapters/${review.chapter?.id}`}>
                {review.chapter?.name}
              </Link>
            </p>
          )}

          <Link to={`/profile/${review.user.id}`} className="review-user">
            <img src={review.user.picture} alt="" />
            {review.user.username}
          </Link>

          {review_type !== "children" && <p>Rating: {review.rating}/5</p>}
          <p>{review.description}</p>

          <div className="reaction">
            <div className="like-div">
              <p>{review.likes}</p>
              <Reaction review={review.id} type="Like" active={review.my_reaction === "like"} resetFunc={loadReviews}  />
            </div>
            <div className="dislike-div">
              <p>{review.dislikes}</p>
              <Reaction review={review.id} type="Dislike" active={review.my_reaction === "dislike"} resetFunc={loadReviews} />
            </div>
          </div>

          {review.is_edited && <p>[Edited]</p>}

          {user?.id === review.user.id && (
            <>
              <details>
                <summary>Edit review</summary>
                <EditReview
                  review={{
                    id: review.id,
                    description: review.description,
                    rating: review.rating?.toString() ?? "",
                  }}
                  resetFunc={loadReviews}
                />
              </details>
              <RemoveReview review={review.id} resetFunc={loadReviews} />
            </>
          )}

          {user && (
            <ReviewForm
              chapter={undefined}
              parent={review.id}
              resetFunc={loadReviews}
            />
          )}

          <hr />
          <Comments reviewId={review.id} />
        </li>
      ))}
    </ul>
  )
}

function Comments({ reviewId }: { reviewId: number }) {
  const [open, setOpen] = useState(false)

  return (
    <details onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>Comments</summary>
      {open && (
        <ReviewComponent id={reviewId.toString()} review_type="children" />
      )}
    </details>
  )
}

export default ReviewComponent