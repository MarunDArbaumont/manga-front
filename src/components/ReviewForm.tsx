import { useState } from "react"
import API_BASE_URL from "../api/variables"
import { useNavigate } from "react-router-dom"

function ReviewForm(chapter: number) {
    const [rating, setRating] = useState("")
    const [description, setDescription] = useState("")
    const navigate = useNavigate()

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const reviewInfo = {
            rating: rating,
            description: description,
            chapter: chapter,
        }
        fetch(API_BASE_URL + "reviews", {
            method: "POST",
            headers: {
                "Content-Type": "Application/JSON",
            },
            body: JSON.stringify(reviewInfo),
        })
        .then((response) => response.json())
        .then(() => {
            navigate(`/chapters/${chapter}`)
        })
        .catch((error) => {
            throw error
        })
    }
    return (
        <form onSubmit={handleSubmit}>
            <label>Rating
                <input 
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(event) => setRating(event.target.value)}
                />
            </label>
            <label>Description
                <input 
                type="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                />
            </label>
            <button type="submit">Submit review</button>
        </form>
    )
}

export default ReviewForm