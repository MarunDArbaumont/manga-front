import { useState, type MouseEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/useAuth"

function Disconnect() {
    const { logout } = useAuth()
    const navigate = useNavigate()
    const [busy, setBusy] = useState(false)

    const handleClick = async (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault()
        if (busy) return

        setBusy(true)
        await logout()
        navigate("/", { replace: true })
    }

    return (
        <Link
            className="disconnect"
            onClick={handleClick}
            to="/"
            aria-busy={busy}
        >
            {busy ? "Disconnecting..." : "Disconnect"}
        </Link>
    )
}

export default Disconnect
