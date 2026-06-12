
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

function Disconnect() {
    const { logout } = useAuth()
    const navigate = useNavigate()
    const handleClick = () => {
        logout()
        navigate("/")
    }

    return (
        <a className="disconnect" onClick={handleClick}>Disconnect</a>
    )
}

export default Disconnect