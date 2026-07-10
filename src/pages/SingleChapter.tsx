import { useParams } from "react-router-dom"
import ErrorMessage from "../components/ErrorMessage"
import SingleChapter from "../components/SingleChapter"

function SingleChapterPage() {
    const { id } = useParams<{ id: string }>()

    if (!id) {
        return <ErrorMessage message="Invalid chapter id" />
    }

    return (
        <div className="content">
            <SingleChapter id={id} />
        </div>
    )
}


export default SingleChapterPage