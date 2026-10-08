import { useNavigate } from "react-router-dom"
import { addToCollection } from "../api/users"
import { ApiError } from "../api/api"
import { useState } from "react"

function AddToCollection({chapter}: {chapter: number}) {
    const navigate = useNavigate()
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setError(null)
        setSubmitting(true)

        try {
            await addToCollection(chapter)
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
            navigate("/account")
        }
    }

    return (
        <>
        {error && <p role="alert">{error}</p>}
        <button onClick={handleSubmit}>
            {submitting ? "Adding..." : "Add this chapter to your collection"}
        </button>
        </>
    )
}

export default AddToCollection