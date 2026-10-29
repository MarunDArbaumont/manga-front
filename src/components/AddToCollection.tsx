import { addToCollection } from "../api/users"
import { getApiErrorMessage, type ApiErrorMessages } from "../api/api"
import { useMutation } from "../hooks/useMutation"
import { useState } from "react"

const ERROR_MESSAGES: ApiErrorMessages = {
    status: {
        400: "This is not a chapter.",
        401: "You need to be logged in to add to collection.",
        403: "You need to be logged in to add to collection.",
    },
}

function AddToCollection({chapter}: {chapter: number}) {
    const [message, setMessage] = useState<string | null>(null)
    const { mutate, pending, error } = useMutation(addToCollection)

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setMessage(null)

        const result = await mutate(chapter)
        if (result.ok) setMessage("Chapter added to your collection.")
    }

    return (
        <>
        {error ? <p role="alert">{getApiErrorMessage(error, ERROR_MESSAGES)}</p> : null}
        {message && <p role="status">{message}</p>}
        <button type="button" onClick={handleSubmit} disabled={pending}>
            {pending ? "Adding..." : "Add this chapter to your collection"}
        </button>
        </>
    )
}

export default AddToCollection
