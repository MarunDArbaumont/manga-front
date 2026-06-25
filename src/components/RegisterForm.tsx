import { useState } from "react"
import API_BASE_URL from "../api/variables"
import { useNavigate } from "react-router-dom"

function RegisterForm() {
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const registerInfo = {
            username: username,
            password: password,
            email: email,
        }
        fetch(API_BASE_URL + "users/", {
            method: "POST",
            headers: {
                "Content-Type": "Application/JSON",
            },
            body: JSON.stringify(registerInfo),
        })
        .then((response) => response.json())
        .then(() => {
            navigate("/")
        })
        .catch((error) => {
            throw error
        })
    }
    return (
        <form onSubmit={handleSubmit}>
            <label>Email
                <input 
                type="text"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                />
            </label>
            <label>Username
                <input 
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                />
            </label>
            <label>Password
                <input 
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                />
            </label>
            <button type="submit">Submit</button>
        </form>
    )
}

export default RegisterForm