import { useState } from "react"
import API_BASE_URL from "../api/variables"

function LoginForm() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const loginInfo = {
            username: username,
            password: password,
        };
        fetch(API_BASE_URL + "token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginInfo),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Invalid credentials")
            }
            return response.json()
        })
        .then((newLoginCookie) => {
            localStorage.setItem("refresh", newLoginCookie.refresh)
            localStorage.setItem("access", newLoginCookie.access)
            console.log(localStorage.getItem("refresh"))
            console.log(localStorage.getItem("access"))
        })
        .catch((error) => {
            console.log(error);
        })
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