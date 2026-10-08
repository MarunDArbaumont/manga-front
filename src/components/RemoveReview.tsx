import { useState } from "react"
import { deleteReview } from "../api/users"
import { ApiError } from "../api/api"

type Props = {
    review: number
    resetFunc: () => void
}

function RemoveReview({ review, resetFunc }: Props) {
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setError(null)
        setSubmitting(true)

        try {
            await deleteReview(review)
            } catch (err) {
            if (err instanceof ApiError && err.status === 400) {
                setError("This is not a chapter.")
            } else if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
                setError("You need to be logged in to add to collection.")
            } else {
                setError("Something went wrong, please try again.")
            }
            } finally {
            setSubmitting(false)
        }
        resetFunc()
    }
    return (
        <>
        {error && <p role="alert">{error}</p>}
        <button onClick={handleSubmit}>
            {submitting ? "Deleting..." : "Delete review"}
        </button>
        </>
    )
}

export default RemoveReview