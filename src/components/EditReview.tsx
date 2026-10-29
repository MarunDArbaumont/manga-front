import { getApiErrorMessage, type ApiErrorMessages } from "../api/api"
import { editReview } from "../api/users"
import { useState, type FormEvent } from "react"
import { useMutation } from "../hooks/useMutation"

type Props = {
    review: {
        id: number
        rating?: string | null
        description: string
    }
    resetFunc: () => void
}

const ERROR_MESSAGES: ApiErrorMessages = {
    status: {
        400: "Your review is invalid, please check the fields.",
        401: "You need to be logged in to edit a review.",
        403: "You need to be logged in to edit a review.",
    },
}

function EditReview({ review, resetFunc }: Props) {
    const isReply = review.rating == null || review.rating === ""
    const [rating, setRating] = useState(review.rating ?? "")
    const [description, setDescription] = useState(review.description)
    const { mutate, pending, error } = useMutation(editReview)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const result = await mutate({
            rating: isReply ? null : Number(rating),
            description,
        }, review.id)

        if (result.ok) resetFunc()
    }

    return (
        <>
            {error ? <p role="alert">{getApiErrorMessage(error, ERROR_MESSAGES)}</p> : null}
            <form onSubmit={handleSubmit}>
                {!isReply && (
                    <label>Rating
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
                <label>Description
                    <input
                        type="text"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        required
                    />
                </label>
                <button type="submit" disabled={pending}>
                    {pending ? "Saving..." : "Save review"}
                </button>
            </form>
        </>
    )
}

export default EditReview
