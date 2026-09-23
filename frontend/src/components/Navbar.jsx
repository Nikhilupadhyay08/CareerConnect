import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= 768
  );
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;

      setIsMobile(mobile);

      if (!mobile) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
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

        {/* ================= DESKTOP NAVIGATION ================= */}

        {!isMobile && (
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
                {user?.role === "jobseeker" && (
                  <>
                    <NavLink
                      to="/jobseeker/dashboard"
                      label="Dashboard"
                      active={isActive("/jobseeker/dashboard")}
                    />

                    <NavLink
                      to="/saved-jobs"
                      label="Saved Jobs"
                      active={isActive("/saved-jobs")}
                    />
                  </>
                )}

                {user?.role === "employer" && (
                  <NavLink
                    to="/employer/dashboard"
                    label="Dashboard"
                    active={isActive("/employer/dashboard")}
                  />
                )}

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
                      active={isActive(
                        "/admin/applications"
                      )}
                    />
                  </>
                )}

                <NavLink
                  to="/profile"
                  label="Profile"
                  active={isActive("/profile")}
                />

                <div style={styles.userArea}>
                  <div style={styles.userAvatar}>
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <span style={styles.userName}>
                    {user?.name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  style={styles.logoutButton}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}

        {/* ================= MOBILE MENU BUTTON ================= */}

        {isMobile && (
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            style={styles.menuButton}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span
              style={{
                ...styles.menuLine,
                transform: menuOpen
                  ? "rotate(45deg) translate(5px, 5px)"
                  : "none",
              }}
            ></span>

            <span
              style={{
                ...styles.menuLine,
                opacity: menuOpen ? 0 : 1,
              }}
            ></span>

            <span
              style={{
                ...styles.menuLine,
                transform: menuOpen
                  ? "rotate(-45deg) translate(5px, -5px)"
                  : "none",
              }}
            ></span>
          </button>
        )}
      </div>

      {/* ================= MOBILE NAVIGATION ================= */}

      {isMobile && menuOpen && (
        <div style={styles.mobileMenu}>

          <MobileNavLink
            to="/"
            label="Home"
            active={isActive("/")}
          />

          {user?.role !== "admin" && (
            <MobileNavLink
              to="/jobs"
              label="Jobs"
              active={isActive("/jobs")}
            />
          )}

          {!isAuthenticated ? (
            <>
              <MobileNavLink
                to="/login"
                label="Login"
                active={isActive("/login")}
              />

              <Link
                to="/register"
                style={styles.mobileRegisterButton}
              >
                Get Started
                <span>→</span>
              </Link>
            </>
          ) : (
            <>
              {user?.role === "jobseeker" && (
              <>
                <MobileNavLink
                  to="/jobseeker/dashboard"
                  label="Dashboard"
                  active={isActive("/jobseeker/dashboard")}
                />

                <MobileNavLink
                  to="/saved-jobs"
                  label="Saved Jobs"
                  active={isActive("/saved-jobs")}
                />
              </>
            )}

              {user?.role === "employer" && (
                <MobileNavLink
                  to="/employer/dashboard"
                  label="Dashboard"
                  active={isActive("/employer/dashboard")}
                />
              )}

              {user?.role === "admin" && (
                <>
                  <MobileNavLink
                    to="/admin"
                    label="Dashboard"
                    active={isActive("/admin")}
                  />

                  <MobileNavLink
                    to="/admin/users"
                    label="Users"
                    active={isActive("/admin/users")}
                  />

                  <MobileNavLink
                    to="/admin/jobs"
                    label="Jobs"
                    active={isActive("/admin/jobs")}
                  />

                  <MobileNavLink
                    to="/admin/applications"
                    label="Applications"
                    active={isActive(
                      "/admin/applications"
                    )}
                  />
                </>
              )}

              <MobileNavLink
                to="/profile"
                label="Profile"
                active={isActive("/profile")}
              />

              <div style={styles.mobileUserArea}>
                <div style={styles.userAvatar}>
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <span style={styles.mobileUserName}>
                  {user?.name}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                style={styles.mobileLogoutButton}
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

/* ================= DESKTOP NAV LINK ================= */

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

/* ================= MOBILE NAV LINK ================= */

function MobileNavLink({ to, label, active }) {
  return (
    <Link
      to={to}
      style={{
        ...styles.mobileNavLink,
        ...(active ? styles.mobileActiveNavLink : {}),
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
    minHeight: "70px",
    background: "rgba(255, 255, 255, 0.97)",
    borderBottom: "1px solid #e2e8f0",
    backdropFilter: "blur(12px)",
  },

  container: {
    maxWidth: "1240px",
    minHeight: "70px",
    margin: "0 auto",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
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
    justifyContent: "flex-end",
  },

  navLink: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: "38px",
    padding: "0 11px",
    borderRadius: "8px",
    color: "#64748b",
    textDecoration: "none",
    fontSize: "12px",
    fontWeight: "600",
    whiteSpace: "nowrap",
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
    whiteSpace: "nowrap",
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
    flexShrink: 0,
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
    background: "#ffffff",
    color: "#dc2626",
    fontSize: "11px",
    fontWeight: "700",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  /* ================= MOBILE ================= */

  menuButton: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
    cursor: "pointer",
    flexShrink: 0,
  },

  menuLine: {
    width: "20px",
    height: "2px",
    borderRadius: "999px",
    background: "#334155",
    transition: "all 0.2s ease",
  },

  mobileMenu: {
    width: "100%",
    boxSizing: "border-box",
    background: "#ffffff",
    borderTop: "1px solid #f1f5f9",
    borderBottom: "1px solid #e2e8f0",
    padding: "12px 20px 18px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
  },

  mobileNavLink: {
    display: "flex",
    alignItems: "center",
    minHeight: "44px",
    padding: "0 13px",
    borderRadius: "9px",
    color: "#475569",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
  },

  mobileActiveNavLink: {
    color: "#4f46e5",
    background: "#eef2ff",
    fontWeight: "700",
  },

  mobileRegisterButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: "44px",
    padding: "0 14px",
    marginTop: "5px",
    borderRadius: "9px",
    background: "linear-gradient(135deg, #4f46e5, #2563eb)",
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "700",
  },

  mobileUserArea: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 13px",
    marginTop: "5px",
    borderTop: "1px solid #e2e8f0",
  },

  mobileUserName: {
    color: "#334155",
    fontSize: "13px",
    fontWeight: "700",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  mobileLogoutButton: {
    width: "100%",
    minHeight: "42px",
    borderRadius: "9px",
    border: "1px solid #fecaca",
    background: "#ffffff",
    color: "#dc2626",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default Navbar;