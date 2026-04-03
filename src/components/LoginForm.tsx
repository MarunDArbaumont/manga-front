import { useState } from "react"
import {setToken} from "../api/token"
import type {loginInfoType} from "../api/token"

function LoginForm() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const loginInfo: loginInfoType = {
            username: username,
            password: password,
        }
        setToken(loginInfo)
    }
    return (
        <>
        <form onSubmit={handleSubmit}>
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