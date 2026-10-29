import { useState, type FormEvent } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { getApiErrorMessage } from "../api/api"
import { registerUser } from "../api/users"
import { useMutation } from "../hooks/useMutation"

type FromLocation = {
    pathname: string
    search?: string
    hash?: string
}

function RegisterForm() {
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const location = useLocation()
    const { mutate, pending, error } = useMutation(registerUser)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const result = await mutate({ username, password, email })
        if (result.ok) {
            const from = (
                location.state as { from?: FromLocation } | null
            )?.from

            navigate("/login", {
                replace: true,
                state: {
                    registered: true,
                    ...(from ? { from } : {}),
                },
            })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="register-form">
            <label>Email
                <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                />
            </label>
            <label>Username
                <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                />
            </label>
            <label>Password
                <input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                />
            </label>
            {error ? (
                <p role="alert">
                    {getApiErrorMessage(error, {
                        fallback: "Could not create your account. Please try again.",
                        status: { 429: "Too many signup attempts, please try again later." },
                    })}
                </p>
            ) : null}
            <button type="submit" disabled={pending}>
                {pending ? "Creating account..." : "Submit"}
            </button>
        </form>
    )
}

export default RegisterForm
