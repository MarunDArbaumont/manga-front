import API_BASE_URL from "../api/variables"
import { useAuth } from "../hooks/useAuth"
import { fectchRefreshToken } from "../api/token"
import { useState } from "react"

type Props = {
    profile: {
        id: number
        bio: string
    }
    resetFunc: () => void
}

function EditProfileBio({ profile, resetFunc }: Props) {
    const { user, setUser } = useAuth()
    const [bio, setBio] = useState(profile.bio)
    

    async function postReview(token: string) {
        return fetch(API_BASE_URL + "profiles/" + profile.id + "/", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify({
                bio,
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
                <label>Description
                    <input 
                    type="text"
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                    />
                </label>
                <button type="submit">Update bio</button>
            </form>
        </>
    )
}

export default EditProfileBio