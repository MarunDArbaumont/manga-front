import { useParams } from "react-router-dom"
import ErrorMessage from "../components/ErrorMessage"
import SingleChapter from "../components/SingleChapter"

function SingleSeriePage() {
    const { id } = useParams<{ id: string }>()

    if (!id) {
        return <ErrorMessage message="Invalid chapter id" />
    }

    return (
        <SingleChapter id={id} />
    )
}


export default SingleSeriePage