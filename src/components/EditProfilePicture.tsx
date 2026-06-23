import API_BASE_URL from "../api/variables"
import { useAuth } from "../hooks/useAuth"
import { fectchRefreshToken } from "../api/token"
import { useState } from "react"

type Props = {
    profile: {
        id: number
    }
    resetFunc: () => void
}

function EditProfilePicture({ profile, resetFunc }: Props) {
    const { user, setUser } = useAuth()
    const [picture, setPicture] = useState<File | null>(null)
    
    

    async function postPicture(token: string) {
        if (!picture) {
            throw new Error("No picture selected")
        }

        const formData = new FormData()
        formData.append("profile_picture", picture)

        return fetch(API_BASE_URL + "profiles/" + profile.id + "/", {
            method: "PATCH",
            headers: {
                "Authorization": "Bearer " + token,
            },
            body: formData,
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
            let response = await postPicture(access)
            
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

                response = await postPicture(newAccess)
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
                    <input 
                    type="file"
                    onChange={(event) => {
                        const file = event.target.files?.[0]
                        if (file) {
                            setPicture(file)
                        }
                    }}
                    accept="image/png, image/jpeg, image/jpg" 
                    />
                <button type="submit">Update profile picture</button>
            </form>
        </>
    )
}

export default EditProfilePicture