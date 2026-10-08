import { ApiError } from "../api/api"
import { editReview } from "../api/users"
import { useState, type FormEvent } from "react"

type Props = {
    review: {
        id: number
        rating?: string
        description: string
    }
    resetFunc: () => void
}

function EditReview({ review, resetFunc }: Props) {
    const [rating, setRating] = useState("")
    const [description, setDescription] = useState("")
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError(null)

        try {
        await editReview({
            rating: parent ? null : Number(rating),
            description,
        }, review.id)
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
        }
    }
    
    return (
        <>
            {error && <p role="alert">{error}</p>}
            <form onSubmit={handleSubmit}>
                {rating? (
                    <label>Rating
                        <input 
                        type="number"
                        min="1"
                        max="5"
                        value={rating}
                        onChange={(event) => setRating(event.target.value)}
                        />
                    </label>
                ): null}
                <label>Description
                    <input 
                    
                    type="text"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    />
                </label>
                <button type="submit">Submit review</button>
            </form>
        </>
    )
}

export default EditReview