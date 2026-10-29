import { useState, type FormEvent } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/useAuth"
import { getApiErrorMessage } from "../api/api"
import { useMutation } from "../hooks/useMutation"

type FromLocation = {
  pathname: string
  search?: string
  hash?: string
}

type LoginState = {
  from?: FromLocation
  registered?: boolean
}

function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LoginState | null
  const { login } = useAuth()
  const { mutate, pending, error } = useMutation(login)

  const from = state?.from
  const redirectTo =
    from &&
    from.pathname !== "/login" &&
    from.pathname !== "/register"
      ? `${from.pathname}${from.search ?? ""}${from.hash ?? ""}`
      : "/"

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const result = await mutate(username, password)
    if (result.ok) navigate(redirectTo, { replace: true })
  }

  return (
    <form onSubmit={handleLogin} className="login-form">
      {state?.registered ? (
        <p role="status" className="form-status">
          Your account was created. Please log in.
        </p>
      ) : null}

      <label>
        Username:
        <input
          type="text"
          name="username"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>

      {error ? (
        <p role="alert" className="login-error">
          {getApiErrorMessage(error, { status: { 400: "Invalid username or password." } })}
        </p>
      ) : null}

      <button type="submit" disabled={pending}>
        {pending ? "Logging in..." : "Log in"}
      </button>
    </form>
  )
}

export default LoginForm
