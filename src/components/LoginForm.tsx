import { useState } from "react"
import {fetchUser} from "../api/token"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

function LoginForm() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const { login } = useAuth();
    
    const handleLogin = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault()

        try {
            const user = await fetchUser({
                username,
                password,
            })

            login(user)
            navigate("/")
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
        <form onSubmit={handleLogin}>
            <label>
                Username:
                <input
                type="text"
                name="username"
                onChange={(event) => setUsername(event.target.value)} />
            </label>
            <label>
                Password:
                <input
                type="password"
                name="password"
                onChange={(event) => setPassword(event.target.value)} />
            </label>
            <input
            type="submit"
            value="Submit" />
        </form>
        </>
    )
}

export default LoginForm