import { useParams } from "react-router-dom"
import SingleSerie from "../components/SingleSerie"
import ErrorMessage from "../components/ErrorMessage"

function SingleSeriePage() {
    const { id } = useParams<{ id: string }>()

    if (!id) {
        return <ErrorMessage message="Invalid series id" />
    }

    return (
        <div className="content">
            <SingleSerie id={id} />
        </div>
    )
}


export default SingleSeriePage