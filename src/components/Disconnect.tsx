import { clearToken } from "../api/token"

function Disconnect() {
    const handleClick = () => {
        clearToken()
    }

    return (
        <button onClick={handleClick}>Disconnect</button>
    )
}

export default Disconnect