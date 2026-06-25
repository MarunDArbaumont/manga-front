import API_BASE_URL from "../api/variables"
import { useAuth } from "../hooks/useAuth"
import { fectchRefreshToken } from "../api/token"

type Props = {
    review: number
    resetFunc: () => void
}

function RemoveReview({ review, resetFunc }: Props) {
    const { user, setUser } = useAuth()
    

    async function postReview(token: string) {
        return fetch(API_BASE_URL + "reviews/" + review + "/", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify({
                review,
            }),
        })
    }

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
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
                throw new Error("Failed to remove review")
            }
            resetFunc()
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <button onClick={handleSubmit}>
            Remove review
        </button>
    )
}

export default RemoveReview