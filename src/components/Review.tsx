import { useCallback, useEffect, useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  fetchReviewsPage,
  type ReviewType,
} from "../api/users"
import { getApiErrorMessage, type ResultPagination } from "../api/api"
import { useAuth } from "../context/useAuth"
import { useApiResource } from "../hooks/useApiResource"
import { mediaUrl } from "../api/variables"
import defaultProfilePicture from "../assets/img/Pandaman_Oda.jpg"
import EditReview from "./EditReview"
import EmptyState from "./EmptyState"
import ErrorMessage from "./ErrorMessage"
import Loading from "./Loading"
import Pagination from "./Pagination"
import Reaction from "./Reaction"
import RemoveReview from "./RemoveReview"
import ReviewForm from "./ReviewForm"

type Props = {
  id: string
  review_type: "chapter" | "user" | "children"
}

const PAGE_SIZE = 10

function ReviewComponent({ id, review_type }: Props) {
  const { user } = useAuth()
  const [offset, setOffset] = useState(0)

  const loadReviews = useCallback(() => {
    const params = { limit: PAGE_SIZE, offset }

    if (review_type === "chapter") {
      return fetchReviewsPage({ ...params, chapter: id })
    }
    if (review_type === "user") {
      return fetchReviewsPage({ ...params, user: id })
    }
    return fetchReviewsPage({ ...params, parent: id })
  }, [id, offset, review_type])

  const { data, error, loading, reload } = useApiResource<ResultPagination<ReviewType>>(loadReviews)
  const reviews = data?.results ?? []

  const userId = user?.id
  const previousUserId = useRef(userId)

  // Reaction state changes with the session, so refresh when auth changes.
  useEffect(() => {
    if (previousUserId.current !== userId) {
      previousUserId.current = userId
      reload()
    }
  }, [reload, userId])

  const emptyMessage =
    review_type === "children" ? "No comments yet." : "No reviews yet."

  if (loading) return <Loading message="Loading reviews..." />
  if (error) {
    return <ErrorMessage message={getApiErrorMessage(error, { fallback: "Failed to load reviews." })} />
  }

  return (
    <>
      {reviews.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id} className="single-review">
              {review_type === "children" && (
                <p className="review-context">Response to a review</p>
              )}

              {review_type === "user" && (
                <p>
                  {review.chapter ? (
                    <>
                      Chapter:{" "}
                      <Link to={`/chapters/${review.chapter.id}`}>
                        {review.chapter.name}
                      </Link>{" "}
                      from {review.chapter.manga.title}
                    </>
                  ) : (
                    "Reply to a review"
                  )}
                </p>
              )}

              <Link to={`/profile/${review.user.id}`} className="review-user">
                <img
                  src={mediaUrl(review.user.picture, defaultProfilePicture)}
                  alt={`${review.user.username}'s profile picture`}
                />
                {review.user.username}
              </Link>

              {review.rating !== null && review_type !== "children" && (
                <p>Rating: {review.rating}/5</p>
              )}
              {review.description ? <p>{review.description}</p> : null}

              <div className="reaction">
                <div className="like-div">
                  <p>{review.likes}</p>
                  <Reaction review={review.id} type="Like" active={review.my_reaction === "like"} resetFunc={reload} />
                </div>
                <div className="dislike-div">
                  <p>{review.dislikes}</p>
                  <Reaction review={review.id} type="Dislike" active={review.my_reaction === "dislike"} resetFunc={reload} />
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
                        description: review.description ?? "",
                        rating: review.rating?.toString() ?? "",
                      }}
                      resetFunc={reload}
                    />
                  </details>
                  <RemoveReview review={review.id} resetFunc={reload} />
                </>
              )}

              <hr />
              <Comments reviewId={review.id} />
            </li>
          ))}
        </ul>
      )}

      <Pagination
        count={data?.count ?? 0}
        limit={PAGE_SIZE}
        offset={offset}
        onOffsetChange={setOffset}
      />
    </>
  )
}

function Comments({ reviewId }: { reviewId: number }) {
  const { user } = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [version, setVersion] = useState(0)

  return (
    <details onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary>Comments</summary>
      {open ? (
        <>
          <ReviewComponent key={version} id={reviewId.toString()} review_type="children" />
          {user ? (
            <ReviewForm
              chapter={undefined}
              parent={reviewId}
              resetFunc={() => setVersion((current) => current + 1)}
            />
          ) : (
            <p className="login-prompt">
              <Link to="/login" state={{ from: location }}>Log in</Link> to reply.
            </p>
          )}
        </>
      ) : null}
    </details>
  )
}

export default ReviewComponent
