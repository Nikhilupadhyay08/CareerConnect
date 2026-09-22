import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>

        {/* ================= LOGO ================= */}
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>C</span>

          <span style={styles.logoText}>
            Career<span style={styles.logoHighlight}>Connect</span>
          </span>
        </Link>

        {/* ================= NAVIGATION ================= */}
        <div style={styles.links}>

          <NavLink
            to="/"
            label="Home"
            active={isActive("/")}
          />

          {user?.role !== "admin" && (
            <NavLink
              to="/jobs"
              label="Jobs"
              active={isActive("/jobs")}
            />
          )}

          {!isAuthenticated ? (
            <>
              <NavLink
                to="/login"
                label="Login"
                active={isActive("/login")}
              />

              <Link
                to="/register"
                style={styles.registerButton}
              >
                Get Started
                <span style={styles.arrow}>→</span>
              </Link>
            </>
          ) : (
            <>
              {/* Jobseeker */}
              {user?.role === "jobseeker" && (
                <NavLink
                  to="/jobseeker/dashboard"
                  label="Dashboard"
                  active={isActive("/jobseeker/dashboard")}
                />
              )}

              {/* Employer */}
              {user?.role === "employer" && (
                <NavLink
                  to="/employer/dashboard"
                  label="Dashboard"
                  active={isActive("/employer/dashboard")}
                />
              )}

              {/* Admin */}
              {user?.role === "admin" && (
                <>
                  <NavLink
                    to="/admin"
                    label="Dashboard"
                    active={isActive("/admin")}
                  />

                  <NavLink
                    to="/admin/users"
                    label="Users"
                    active={isActive("/admin/users")}
                  />

                  <NavLink
                    to="/admin/jobs"
                    label="Jobs"
                    active={isActive("/admin/jobs")}
                  />

                  <NavLink
                    to="/admin/applications"
                    label="Applications"
                    active={isActive("/admin/applications")}
                  />
                </>
              )}

              {/* Profile */}
              <NavLink
                to="/profile"
                label="Profile"
                active={isActive("/profile")}
              />

              {/* User */}
              <div style={styles.userArea}>
                <div style={styles.userAvatar}>
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <span style={styles.userName}>
                  {user?.name}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={logout}
                style={styles.logoutButton}
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

/* ================= NAV LINK ================= */

function NavLink({ to, label, active }) {
  return (
    <Link
      to={to}
      style={{
        ...styles.navLink,
        ...(active ? styles.activeNavLink : {}),
      }}
    >
      {label}
    </Link>
  );
}

/* ================= STYLES ================= */

const styles = {
  navbar: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    height: "70px",
    background: "rgba(255, 255, 255, 0.96)",
    borderBottom: "1px solid #e2e8f0",
    backdropFilter: "blur(12px)",
  },

  container: {
    maxWidth: "1240px",
    height: "100%",
    margin: "0 auto",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "25px",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    flexShrink: 0,
  },

  logoIcon: {
    width: "37px",
    height: "37px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #4f46e5, #2563eb)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "800",
    boxShadow: "0 5px 14px rgba(79, 70, 229, 0.22)",
  },

  logoText: {
    color: "#111827",
    fontSize: "18px",
    fontWeight: "800",
    letterSpacing: "-0.5px",
  },

  logoHighlight: {
    color: "#4f46e5",
  },

  links: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  navLink: {
    display: "inline-flex",
    alignItems: "center",
    height: "38px",
    padding: "0 11px",
    borderRadius: "8px",
    color: "#64748b",
    textDecoration: "none",
    fontSize: "12px",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },

  activeNavLink: {
    color: "#4f46e5",
    background: "#eef2ff",
    fontWeight: "700",
  },

  registerButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    height: "38px",
    padding: "0 15px",
    marginLeft: "4px",
    borderRadius: "9px",
    background: "linear-gradient(135deg, #4f46e5, #2563eb)",
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "12px",
    fontWeight: "700",
    boxShadow: "0 5px 14px rgba(79, 70, 229, 0.18)",
  },

  arrow: {
    fontSize: "15px",
  },

  userArea: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    paddingLeft: "8px",
    marginLeft: "4px",
    borderLeft: "1px solid #e2e8f0",
  },

  userAvatar: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "#eef2ff",
    color: "#4f46e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: "800",
  },

  userName: {
    maxWidth: "110px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: "#334155",
    fontSize: "11px",
    fontWeight: "700",
  },

  logoutButton: {
    height: "36px",
    padding: "0 12px",
    borderRadius: "8px",
    border: "1px solid #fecaca",
    background: "#fff",
    color: "#dc2626",
    fontSize: "11px",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default Navbar;