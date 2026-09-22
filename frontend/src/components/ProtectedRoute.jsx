import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRole }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // User is not authenticated
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // User is authenticated but does not have the required role
  if (allowedRole && user.role !== allowedRole) {
    switch (user.role) {
      case "admin":
        return <Navigate to="/admin" replace />;

      case "employer":
        return <Navigate to="/employer/dashboard" replace />;

      case "jobseeker":
        return <Navigate to="/jobseeker/dashboard" replace />;

      default:
        return <Navigate to="/" replace />;
    }
  }

  // User is authenticated and has the correct role
  return children;
}

export default ProtectedRoute;