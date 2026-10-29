import { Link } from "react-router-dom"

function NotFound() {
    return (
        <div className="content not-found">
            <h1>Page not found</h1>
            <p>The page you are looking for doesn't exist or has moved.</p>
            <Link to="/">Back to home</Link>
        </div>
    )
}

export default NotFound
