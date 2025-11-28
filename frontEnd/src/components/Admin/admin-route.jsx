
import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/authContext";

export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();



  // Not logged in → redirect
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Logged in but not admin → redirect
  if (!isAdmin) return <Navigate to="/" replace />;

  return children; // permitted
}
