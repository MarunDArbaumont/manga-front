import { useAuth } from "../hooks/useAuth"

function Home() {
    const { user } = useAuth()
    return(
        <div className="content">
            <h1>This is the home page</h1>
            {user ? (
                <p>Hello {user.username}</p>
            ) : null}
        </div>
    )
}

export default Home