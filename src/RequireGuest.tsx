import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/useAuth";
import Loading from "./components/Loading";

/**
 * Keeps authenticated users away from /login and /register.
 */
export function RequireGuest() {
  const { user, loading } = useAuth();

  if (loading) return <Loading message="Checking your session..." />;

  return user ? <Navigate to="/" replace /> : <Outlet />;
}
