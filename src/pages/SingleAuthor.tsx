import { useParams } from "react-router-dom"
import ErrorMessage from "../components/ErrorMessage"
import SingleAuthor from "../components/SingleAuthor"

function SingleAuthorPage() {
    const { id } = useParams<{ id: string }>()

    if (!id) {
        return <ErrorMessage message="Invalid chapter id" />
    }

    return (
        <div className="content">
            <SingleAuthor id={id} />
        </div>
    )
}


export default SingleAuthorPage