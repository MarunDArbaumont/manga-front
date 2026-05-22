import { useAuth } from "../hooks/useAuth"

function Home() {
    const { user } = useAuth()
    return(
        <>
            <h1>This is the home page</h1>
            {user ? (
                <p>Hello {user.username}</p>
            ) : null}
        </>
    )
}

export default Home