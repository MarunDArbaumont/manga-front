function Disconnect() {
    const handleClick = () => {
        localStorage.removeItem("refresh")
        localStorage.removeItem("access")
        console.log(localStorage.getItem("refresh"))
        console.log(localStorage.getItem("access"))
    }

    return (
        <button onClick={handleClick}>Disconnect</button>
    )
}

export default Disconnect