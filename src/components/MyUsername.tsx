import { useEffect, useState } from "react"
import API_BASE_URL from "../api/variables"

function Me() {
    type me = {
        id: number
        username: string
    }

    const [username, setUsername] = useState("")
    async function getMe(url: string): Promise<me> {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access")}`
            }
        })
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }
        const result = await response.json()
        return result
    }
    useEffect(() => {
        async function load() {
            try {
                const data = await getMe(API_BASE_URL + "me")
                setUsername(data.username)
            } catch (err) {
                if (err instanceof Error) {
                    throw new Error(`error`)
                }
            }
        }
        load()
    }, [])
    return (
        <>
            <p><b>{username}</b></p>
        </>
    )
}

export default Me