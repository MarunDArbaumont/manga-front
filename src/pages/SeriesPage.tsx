import Serie from "../components/Series"

function SeriesPage() {
    return (
        <div className="content">
            <h1>Series</h1>
            <p className="page-intro">
                Browse the manga series catalogue and filter by title, genre, or status.
            </p>
            <Serie />
        </div>
    )
}

export default SeriesPage
