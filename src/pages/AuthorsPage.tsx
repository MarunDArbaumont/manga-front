import AllAuhtors from "../components/Authors"

function AuthorsPage() {
    return (
        <div className="content">
            <h1>Authors</h1>
            <p className="page-intro">
                Browse manga authors and the series they have worked on.
            </p>
            <AllAuhtors />
        </div>
    )
}

export default AuthorsPage
