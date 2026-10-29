import { Link } from "react-router-dom"
import { useAuth } from "../context/useAuth"

function Home() {
    const { user } = useAuth()
    return(
        <div className="content">
            <h1>Manga List</h1>
            <p className="page-intro">
                Browse manga series, discover authors, and follow chapters.
            </p>
            {user ? (
                <p>Hello {user.username}</p>
            ) : null}
            <ul className="home-links">
                <li><Link to="/series">Browse series</Link></li>
                <li><Link to="/authors">Browse authors</Link></li>
                <li><Link to="/chapters">Browse chapters</Link></li>
            </ul>
        </div>
    )
}

export default Home
