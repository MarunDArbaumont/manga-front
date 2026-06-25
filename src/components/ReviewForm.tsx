import { useState } from "react"
import API_BASE_URL from "../api/variables"
import { fectchRefreshToken } from "../api/token"
import { useAuth } from "../hooks/useAuth"


type Props = {
    chapter?: number
    parent?: string
    resetFunc: () => void
}

function ReviewForm({ chapter, parent, resetFunc }: Props) {
    const { user, setUser } = useAuth()
    const [rating, setRating] = useState("")
    const [description, setDescription] = useState("")



    async function postReview(token: string) {
        return fetch(API_BASE_URL + "reviews/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify({
                rating: parent ? null : rating,
                description,
                chapter,
                parent,
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
            <h2>Add review</h2>
            <form onSubmit={handleSubmit}>
                {parent == null? (
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

export default ReviewForm