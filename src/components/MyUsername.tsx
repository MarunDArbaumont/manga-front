import { useEffect, useState } from "react"
import API_BASE_URL from "../api/variables"
import getMe from "../api/profile"

function Me() {
    const [username, setUsername] = useState("")
    useEffect(() => {
        async function load() {
            try {
                const data = await getMe(API_BASE_URL + "me")
                setUsername(data.username)
            } catch (err) {
                if (err instanceof Error) {
                    throw err
                }
            }
        }
        load()
    }, [])
    return (
        <>
            {username ? (
                <p><b>{username}</b></p>
            ): null}
            
        </>
    )
}

export default Me