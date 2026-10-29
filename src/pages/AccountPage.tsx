import { Navigate } from "react-router-dom"
import Loading from "../components/Loading"
import { useAuth } from "../context/useAuth"

function AccountPage() {
    const { user, loading } = useAuth()

    if (loading) return <Loading message="Loading your account..." />
    if (!user) return <Navigate to="/login" replace />

    return <Navigate to={`/profile/${user.id}`} replace />
}

export default AccountPage
