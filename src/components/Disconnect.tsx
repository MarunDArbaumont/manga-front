
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { Link } from "react-router-dom"

function Disconnect() {
    const { logout } = useAuth()
    const navigate = useNavigate()
    const handleClick = () => {
        logout()
        navigate("/")
    }

    return (
        <Link className="disconnect" onClick={handleClick} to={"/"}>Disconnect</Link>
    )
}

export default Disconnect