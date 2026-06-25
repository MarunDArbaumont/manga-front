import API_BASE_URL from "../api/variables"
import { useAuth } from "../hooks/useAuth"
import { fectchRefreshToken } from "../api/token"
import { useState } from "react"

type Props = {
    review: {
        id: number
        rating?: string
        description: string
    }
    resetFunc: () => void
}

function EditReview({ review, resetFunc }: Props) {
    const { user, setUser } = useAuth()
    const [description, setDescription] = useState(review.description)
    const [rating, setRating] = useState(review.rating)
    

    async function postReview(token: string) {
        return fetch(API_BASE_URL + "reviews/" + review.id + "/", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify({
                description,
                rating,
            }),
        })
    }

const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault()
        try {
            
            if (!user) throw new Error("No user authenticated")
            const access = user.authToken?.access
            if (!access) {
                throw new Error("No access token")
            }
            let response = await postReview(access)
            
            if (response.status === 401) {
                const refresh = user.authToken?.refresh
                if (!refresh) {
                    throw new Error("No refresh token")
                }
                const newAccess = await fectchRefreshToken(refresh)

                setUser({
                    ...user,
                    authToken: {
                        ...user.authToken!,
                        access: newAccess,
                    },
                })

                response = await postReview(newAccess)
            }
            if (!response.ok) {
                throw new Error("Failed to create review")
            }
            resetFunc()
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <>
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