
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
        <button onClick={handleClick}>Disconnect</button>
    )
}

export default Disconnect