import { useParams } from "react-router-dom"
import ErrorMessage from "../components/ErrorMessage"
import ProfileComponent from "../components/Profile"

function ProfilePage() {
    const { id } = useParams<{ id: string }>()

    if (!id) {
        return <ErrorMessage message="Invalid chapter id" />
    }

    return (
        <div className="content">
            <ProfileComponent id={id} />
        </div>
    )
}


export default ProfilePage