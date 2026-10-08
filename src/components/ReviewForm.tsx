import { useState, type FormEvent } from "react"
import { ApiError } from "../api/api"
import { createReview } from "../api/users"
import type { Chapter } from "../api/chapters"


type Props = {
    chapter?: Chapter
    parent?: number
    resetFunc: () => void
}

function ReviewForm({ chapter, parent, resetFunc }: Props) {
    const [rating, setRating] = useState("")
    const [description, setDescription] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError(null)
        setSubmitting(true)

        try {
        await createReview({
            rating: parent ? null : Number(rating),
            description,
            chapter,
            parent,
        })
        setRating("")
        setDescription("")
        resetFunc()
        } catch (err) {
        if (err instanceof ApiError && err.status === 400) {
            setError("Your review is invalid, please check the fields.")
        } else if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
            setError("You need to be logged in to post a review.")
        } else {
            setError("Something went wrong, please try again.")
        }
        } finally {
        setSubmitting(false)
    }
  }

  return (
    <>
      <h2>{parent ? "Reply" : "Add review"}</h2>
      <form onSubmit={handleSubmit}>
        {parent == null && (
          <label>
            Rating
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(event) => setRating(event.target.value)}
              required
            />
          </label>
        )}
        <label>
          Description
          <input
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </label>

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Sending..." : "Submit review"}
        </button>
      </form>
    </>
  )
}

export default ReviewForm