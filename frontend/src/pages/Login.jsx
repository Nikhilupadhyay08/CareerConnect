import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // ==================== HANDLERS ====================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(formData);

      login(data);

      if (data.user.role === "admin") {
        navigate("/admin");
      } else if (data.user.role === "employer") {
        navigate("/employer/dashboard");
      } else {
        navigate("/jobseeker/dashboard");
      }
    } catch (error) {
      setError(
        error.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        ...styles.page,
        ...(isMobile ? styles.mobilePage : {}),
      }}
    >
      {/* Background Decorations */}
      <div style={styles.backgroundShapeOne}></div>
      <div style={styles.backgroundShapeTwo}></div>

      <div
        style={{
          ...styles.container,
          ...(isMobile ? styles.mobileContainer : {}),
        }}
      >
        {/* ==================== LEFT SIDE ==================== */}

        {!isMobile && (
          <div style={styles.brandSection}>
            <div style={styles.brandContent}>
              <div style={styles.badge}>
                👋 Welcome back
              </div>

              <h1 style={styles.brandHeading}>
                Your next
                <br />
                opportunity is{" "}
                <span style={styles.highlight}>
                  waiting.
                </span>
              </h1>

              <p style={styles.brandDescription}>
                Sign in to CareerConnect and continue
                exploring opportunities, managing
                applications, and building your career.
              </p>

              <div style={styles.features}>
                <Feature
                  icon="💼"
                  title="Explore opportunities"
                  description="Discover jobs that match your skills and career goals."
                />

                <Feature
                  icon="📄"
                  title="Manage applications"
                  description="Keep track of your applications in one place."
                />

                <Feature
                  icon="🚀"
                  title="Keep moving forward"
                  description="Take the next step toward your professional goals."
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================== RIGHT SIDE ==================== */}

        <div
          style={{
            ...styles.formSection,
            ...(isMobile ? styles.mobileFormSection : {}),
          }}
        >
          <div
            style={{
              ...styles.formCard,
              ...(isMobile ? styles.mobileFormCard : {}),
            }}
          >
            <div style={styles.formHeader}>
              <div
                style={{
                  ...styles.mobileLoginBadge,
                  display: isMobile ? "inline-block" : "none",
                }}
              >
                🔐 Secure Login
              </div>

              <h2
                style={{
                  ...styles.title,
                  ...(isMobile ? styles.mobileTitle : {}),
                }}
              >
                Welcome back
              </h2>

              <p style={styles.subtitle}>
                Sign in to continue to CareerConnect
              </p>
            </div>

            {/* Error Message */}

            {error && (
              <div style={styles.errorBox}>
                <span>⚠</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* ==================== EMAIL ==================== */}

              <div style={styles.field}>
                <label
                  htmlFor="email"
                  style={styles.label}
                >
                  Email Address
                </label>

                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>
                    ✉
                  </span>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    style={styles.input}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* ==================== PASSWORD ==================== */}

              <div style={styles.field}>
                <label
                  htmlFor="password"
                  style={styles.label}
                >
                  Password
                </label>

                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>
                    🔒
                  </span>

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    style={styles.input}
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous
                      )
                    }
                    style={styles.passwordButton}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* ==================== SUBMIT ==================== */}

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.submitButton,
                  ...(loading
                    ? styles.submitButtonDisabled
                    : {}),
                }}
              >
                {loading ? (
                  <>
                    <span style={styles.spinner}></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <span style={styles.arrow}>
                      →
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* ==================== REGISTER ==================== */}

            <div style={styles.divider}>
              <span>New to CareerConnect?</span>
            </div>

            <Link
              to="/register"
              style={styles.registerLink}
            >
              Create your account
              <span style={styles.registerArrow}>
                →
              </span>
            </Link>

            <p style={styles.terms}>
              By continuing, you agree to use
              CareerConnect responsibly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== FEATURE COMPONENT ====================

function Feature({
  icon,
  title,
  description,
}) {
  return (
    <div style={styles.feature}>
      <div style={styles.featureIcon}>
        {icon}
      </div>

      <div>
        <h3 style={styles.featureTitle}>
          {title}
        </h3>

        <p style={styles.featureDescription}>
          {description}
        </p>
      </div>
    </div>
  );
}

// ==================== STYLES ====================

const styles = {
  page: {
    minHeight: "calc(100vh - 70px)",
    background:
      "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f8fafc 100%)",
    position: "relative",
    overflow: "hidden",
    padding: "50px 24px",
    boxSizing: "border-box",
  },

  mobilePage: {
    minHeight: "calc(100vh - 70px)",
    padding: "24px 16px 40px",
    overflow: "visible",
  },

  backgroundShapeOne: {
    position: "absolute",
    width: "420px",
    height: "420px",
    borderRadius: "50%",
    background: "rgba(99, 102, 241, 0.08)",
    top: "-180px",
    left: "-150px",
    pointerEvents: "none",
  },

  backgroundShapeTwo: {
    position: "absolute",
    width: "350px",
    height: "350px",
    borderRadius: "50%",
    background: "rgba(59, 130, 246, 0.07)",
    bottom: "-150px",
    right: "-100px",
    pointerEvents: "none",
  },

  container: {
    maxWidth: "1180px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 500px",
    gap: "70px",
    alignItems: "center",
    position: "relative",
    zIndex: 1,
  },

  mobileContainer: {
    display: "block",
    width: "100%",
    maxWidth: "100%",
  },

  brandSection: {
    padding: "20px 0",
  },

  brandContent: {
    maxWidth: "570px",
  },

  badge: {
    display: "inline-block",
    background: "#eef2ff",
    color: "#4f46e5",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "22px",
  },

  brandHeading: {
    fontSize: "50px",
    lineHeight: "1.1",
    letterSpacing: "-1.8px",
    color: "#111827",
    margin: "0 0 22px",
    fontWeight: "800",
  },

  highlight: {
    color: "#4f46e5",
  },

  brandDescription: {
    color: "#64748b",
    fontSize: "17px",
    lineHeight: "1.7",
    margin: "0 0 35px",
    maxWidth: "520px",
  },

  features: {
    display: "flex",
    flexDirection: "column",
    gap: "22px",
  },

  feature: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  featureIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    boxShadow:
      "0 5px 15px rgba(15, 23, 42, 0.07)",
    flexShrink: 0,
  },

  featureTitle: {
    margin: "0 0 3px",
    fontSize: "15px",
    color: "#1e293b",
    fontWeight: "700",
  },

  featureDescription: {
    margin: 0,
    fontSize: "13px",
    color: "#64748b",
  },

  formSection: {
    width: "100%",
  },

  mobileFormSection: {
    width: "100%",
    maxWidth: "500px",
    margin: "0 auto",
  },

  formCard: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "40px",
    boxShadow:
      "0 20px 60px rgba(15, 23, 42, 0.10)",
    border:
      "1px solid rgba(226, 232, 240, 0.8)",
    boxSizing: "border-box",
  },

  mobileFormCard: {
    width: "100%",
    padding: "24px 20px",
    borderRadius: "20px",
    boxShadow:
      "0 12px 35px rgba(15, 23, 42, 0.08)",
  },

  mobileLoginBadge: {
    background: "#eef2ff",
    color: "#4f46e5",
    padding: "7px 11px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "700",
    marginBottom: "13px",
  },

  formHeader: {
    marginBottom: "28px",
  },

  title: {
    margin: "0 0 8px",
    fontSize: "29px",
    color: "#111827",
    fontWeight: "800",
    letterSpacing: "-0.6px",
  },

  mobileTitle: {
    fontSize: "25px",
  },

  subtitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    padding: "11px 13px",
    borderRadius: "10px",
    fontSize: "13px",
    marginBottom: "20px",
  },

  field: {
    marginBottom: "20px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    color: "#334155",
    fontSize: "13px",
    fontWeight: "700",
  },

  inputWrapper: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    border: "1px solid #dbe2ea",
    borderRadius: "11px",
    background: "#ffffff",
    minHeight: "48px",
    boxSizing: "border-box",
    overflow: "hidden",
  },

  inputIcon: {
    width: "45px",
    minWidth: "45px",
    textAlign: "center",
    fontSize: "16px",
    opacity: 0.65,
  },

  input: {
    flex: 1,
    width: "100%",
    minWidth: 0,
    border: "none",
    outline: "none",
    background: "transparent",
    padding: "13px 10px 13px 0",
    fontSize: "14px",
    color: "#1e293b",
    boxSizing: "border-box",
  },

  passwordButton: {
    border: "none",
    background: "transparent",
    color: "#4f46e5",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    padding: "10px 14px",
    flexShrink: 0,
  },

  submitButton: {
    width: "100%",
    border: "none",
    borderRadius: "11px",
    padding: "14px",
    marginTop: "4px",
    background:
      "linear-gradient(135deg, #4f46e5, #2563eb)",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    boxShadow:
      "0 8px 20px rgba(79, 70, 229, 0.20)",
    boxSizing: "border-box",
  },

  submitButtonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },

  spinner: {
    width: "15px",
    height: "15px",
    border:
      "2px solid rgba(255,255,255,0.4)",
    borderTopColor: "#ffffff",
    borderRadius: "50%",
    display: "inline-block",
  },

  arrow: {
    fontSize: "18px",
  },

  divider: {
    textAlign: "center",
    margin: "24px 0 12px",
    color: "#94a3b8",
    fontSize: "12px",
  },

  registerLink: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    color: "#4f46e5",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "13px",
  },

  registerArrow: {
    fontSize: "17px",
  },

  terms: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "10px",
    lineHeight: "1.5",
    margin: "20px 0 0",
  },
};

export default Login;