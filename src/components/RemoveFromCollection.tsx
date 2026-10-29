import { removeToCollection } from "../api/users"
import { getApiErrorMessage, type ApiErrorMessages } from "../api/api"
import { useMutation } from "../hooks/useMutation"

type Props = {
    chapter: number
    resetFunc: () => void
}

const ERROR_MESSAGES: ApiErrorMessages = {
    status: {
        400: "This is not a chapter.",
        401: "You need to be logged in to remove a chapter from your collection.",
        403: "You need to be logged in to remove a chapter from your collection.",
    },
}

function RemoveFromCollection({ chapter, resetFunc }: Props) {
    const { mutate, pending, error } = useMutation(removeToCollection)

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()

        const result = await mutate(chapter)
        if (result.ok) resetFunc()
    }

    return (
        <>
        {error ? <p role="alert">{getApiErrorMessage(error, ERROR_MESSAGES)}</p> : null}
        <button type="button" onClick={handleSubmit} disabled={pending}>
            {pending ? "Removing..." : "Remove from collection"}
        </button>
        </>
    )
}

export default RemoveFromCollection
