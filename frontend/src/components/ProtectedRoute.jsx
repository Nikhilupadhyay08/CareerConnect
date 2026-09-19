import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRole }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // User is not logged in
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // User is logged in but has the wrong role
  if (allowedRole && user.role !== allowedRole) {
    if (user.role === "employer") {
      return <Navigate to="/employer/dashboard" replace />;
    }

    if (user.role === "jobseeker") {
      return <Navigate to="/jobseeker/dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;