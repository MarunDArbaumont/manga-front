import { useState, type FormEvent } from "react"
import { getApiErrorMessage, type ApiErrorMessages } from "../api/api"
import { createReview } from "../api/users"
import type { Chapter } from "../api/chapters"
import { useMutation } from "../hooks/useMutation"

type Props = {
    chapter?: Chapter
    parent?: number
    resetFunc: () => void
}

const ERROR_MESSAGES: ApiErrorMessages = {
    status: {
        400: "Your review is invalid, please check the fields.",
        401: "You need to be logged in to post a review.",
        403: "You need to be logged in to post a review.",
    },
}

function ReviewForm({ chapter, parent, resetFunc }: Props) {
    const [rating, setRating] = useState("")
    const [description, setDescription] = useState("")
    const { mutate, pending, error } = useMutation(createReview)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const result = await mutate({
            rating: parent ? null : Number(rating),
            description,
            chapter: chapter?.id,
            parent,
        })

        if (result.ok) {
            setRating("")
            setDescription("")
            resetFunc()
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

        {error ? <p role="alert">{getApiErrorMessage(error, ERROR_MESSAGES)}</p> : null}

        <button type="submit" disabled={pending}>
          {pending ? "Sending..." : "Submit review"}
        </button>
      </form>
    </>
  )
}

export default ReviewForm
