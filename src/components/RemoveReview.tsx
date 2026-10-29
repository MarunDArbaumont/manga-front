import { deleteReview } from "../api/users"
import { getApiErrorMessage, type ApiErrorMessages } from "../api/api"
import { useMutation } from "../hooks/useMutation"

type Props = {
    review: number
    resetFunc: () => void
}

const ERROR_MESSAGES: ApiErrorMessages = {
    status: {
        400: "This review is invalid.",
        401: "You need to be logged in to delete a review.",
        403: "You need to be logged in to delete a review.",
    },
}

function RemoveReview({ review, resetFunc }: Props) {
    const { mutate, pending, error } = useMutation(deleteReview)

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()

        const result = await mutate(review)
        if (result.ok) resetFunc()
    }

    return (
        <>
        {error ? <p role="alert">{getApiErrorMessage(error, ERROR_MESSAGES)}</p> : null}
        <button type="button" onClick={handleSubmit} disabled={pending}>
            {pending ? "Deleting..." : "Delete review"}
        </button>
        </>
    )
}

export default RemoveReview
