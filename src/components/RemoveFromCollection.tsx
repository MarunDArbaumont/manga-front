import API_BASE_URL from "../api/variables"
// import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { fectchRefreshToken } from "../api/token"

function RemoveFromCollection({chapter}: {chapter: number}) {
    // const navigate = useNavigate()
    const { user, setUser } = useAuth()
    

    async function postReview(token: string) {
        return fetch(API_BASE_URL + "profiles/remove_manga/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify({
                chapter,
            }),
        })
    }

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        try {          
            if (!user) throw new Error("No user authenticated")
            const access = user.authToken?.access
            console.log(access)
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
                throw new Error("Failed to remove from profile")
            }
            window.location.reload()
            // navigate(`/profile/${user.id}`)
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <button onClick={handleSubmit}>
            Remove chapter
        </button>
    )
}

export default RemoveFromCollection