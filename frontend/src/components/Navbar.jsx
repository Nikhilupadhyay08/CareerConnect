import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">C</span>
          <span>CareerConnect</span>
        </Link>

        {/* Navigation */}
        <div className="navbar-links">
          <Link to="/" className="nav-link">
            Home
          </Link>

          <Link to="/jobs" className="nav-link">
            Jobs
          </Link>

          {!isAuthenticated ? (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>

              <Link to="/register" className="nav-register">
                Get Started
              </Link>
            </>
          ) : (
            <>
              {user?.role === "jobseeker" && (
                <Link
                  to="/jobseeker/dashboard"
                  className="nav-link"
                >
                  Dashboard
                </Link>
              )}

              {user?.role === "employer" && (
                <Link
                  to="/employer/dashboard"
                  className="nav-link"
                >
                  Dashboard
                </Link>
              )}

              <Link to="/profile" className="nav-link">
                Profile
              </Link>

              <span className="nav-user">
                Welcome, {user?.name}
              </span>

              <button
                onClick={logout}
                className="nav-logout"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;