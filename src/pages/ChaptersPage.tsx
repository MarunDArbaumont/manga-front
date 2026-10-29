import AllChapters from "../components/Chapters"

function ChaptersPage() {
    return (
        <div className="content">
            <h1>Chapters</h1>
            <p className="page-intro">
                Browse chapters and filter them by series or chapter number.
            </p>
            <AllChapters />
        </div>
    )
}

export default ChaptersPage
