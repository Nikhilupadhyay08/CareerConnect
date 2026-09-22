import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "jobseeker",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==================== HANDLERS ====================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleRoleChange = (role) => {
    setFormData((previous) => ({
      ...previous,
      role,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await registerUser(formData);

      login(response);

      if (response.user.role === "employer") {
        navigate("/employer/dashboard");
      } else {
        navigate("/jobseeker/dashboard");
      }
    } catch (err) {
      setError(
        err.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Background Decorations */}
      <div style={styles.backgroundShapeOne}></div>
      <div style={styles.backgroundShapeTwo}></div>

      <div style={styles.container}>
        {/* ==================== LEFT SIDE ==================== */}

        <div style={styles.brandSection}>
          <div style={styles.brandContent}>
            <div style={styles.badge}>
              🚀 Start your journey
            </div>

            <h1 style={styles.brandHeading}>
              Build your career.
              <br />
              Find your{" "}
              <span style={styles.highlight}>
                opportunity.
              </span>
            </h1>

            <p style={styles.brandDescription}>
              Create your CareerConnect account and
              discover opportunities that match your
              skills, experience, and career goals.
            </p>

            <div style={styles.features}>
              <Feature
                icon="🔎"
                title="Discover opportunities"
                description="Find jobs that match your skills and interests."
              />

              <Feature
                icon="📄"
                title="Apply with ease"
                description="Submit your applications and resume quickly."
              />

              <Feature
                icon="📊"
                title="Track your progress"
                description="Keep track of your applications in one place."
              />
            </div>
          </div>
        </div>

        {/* ==================== RIGHT SIDE ==================== */}

        <div style={styles.formSection}>
          <div style={styles.formCard}>
            <div style={styles.formHeader}>
              <h2 style={styles.title}>
                Create your account
              </h2>

              <p style={styles.subtitle}>
                Join CareerConnect and start your journey
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
              {/* ==================== NAME ==================== */}

              <div style={styles.field}>
                <label
                  htmlFor="name"
                  style={styles.label}
                >
                  Full Name
                </label>

                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>
                    👤
                  </span>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    style={styles.input}
                    autoComplete="name"
                  />
                </div>
              </div>

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
                    placeholder="Create a password"
                    style={styles.input}
                    autoComplete="new-password"
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

                <span style={styles.helperText}>
                  Use at least 6 characters.
                </span>
              </div>

              {/* ==================== ROLE ==================== */}

              <div style={styles.field}>
                <label style={styles.label}>
                  I am a
                </label>

                <div style={styles.roleContainer}>
                  <RoleCard
                    selected={
                      formData.role === "jobseeker"
                    }
                    icon="👤"
                    title="Job Seeker"
                    description="Find your next opportunity"
                    onClick={() =>
                      handleRoleChange("jobseeker")
                    }
                  />

                  <RoleCard
                    selected={
                      formData.role === "employer"
                    }
                    icon="🏢"
                    title="Employer"
                    description="Find great talent"
                    onClick={() =>
                      handleRoleChange("employer")
                    }
                  />
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
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <span style={styles.arrow}>
                      →
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* ==================== LOGIN ==================== */}

            <div style={styles.divider}>
              <span>Already have an account?</span>
            </div>

            <Link
              to="/login"
              style={styles.loginLink}
            >
              Sign in to your account
            </Link>

            <p style={styles.terms}>
              By creating an account, you agree to use
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

// ==================== ROLE CARD ====================

function RoleCard({
  selected,
  icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles.roleCard,
        ...(selected
          ? styles.roleCardSelected
          : {}),
      }}
      aria-pressed={selected}
    >
      <div
        style={{
          ...styles.roleIcon,
          ...(selected
            ? styles.roleIconSelected
            : {}),
        }}
      >
        {icon}
      </div>

      <div style={styles.roleContent}>
        <div style={styles.roleTitle}>
          {title}
        </div>

        <div style={styles.roleDescription}>
          {description}
        </div>
      </div>

      <div
        style={{
          ...styles.radio,
          ...(selected
            ? styles.radioSelected
            : {}),
        }}
      >
        {selected && (
          <div style={styles.radioDot}></div>
        )}
      </div>
    </button>
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
  },

  backgroundShapeOne: {
    position: "absolute",
    width: "420px",
    height: "420px",
    borderRadius: "50%",
    background: "rgba(99, 102, 241, 0.08)",
    top: "-180px",
    left: "-150px",
  },

  backgroundShapeTwo: {
    position: "absolute",
    width: "350px",
    height: "350px",
    borderRadius: "50%",
    background: "rgba(59, 130, 246, 0.07)",
    bottom: "-150px",
    right: "-100px",
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

  formCard: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "40px",
    boxShadow:
      "0 20px 60px rgba(15, 23, 42, 0.10)",
    border:
      "1px solid rgba(226, 232, 240, 0.8)",
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

  subtitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
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
    marginBottom: "19px",
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
    border: "1px solid #dbe2ea",
    borderRadius: "11px",
    background: "#ffffff",
    minHeight: "48px",
  },

  inputIcon: {
    width: "45px",
    textAlign: "center",
    fontSize: "16px",
    opacity: 0.65,
  },

  input: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    padding: "13px 10px 13px 0",
    fontSize: "14px",
    color: "#1e293b",
    minWidth: 0,
  },

  passwordButton: {
    border: "none",
    background: "transparent",
    color: "#4f46e5",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    padding: "10px 14px",
  },

  helperText: {
    display: "block",
    marginTop: "6px",
    color: "#94a3b8",
    fontSize: "11px",
  },

  roleContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },

  roleCard: {
    display: "flex",
    alignItems: "center",
    textAlign: "left",
    gap: "10px",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    cursor: "pointer",
    minWidth: 0,
  },

  roleCardSelected: {
    border: "1px solid #6366f1",
    background: "#f5f3ff",
    boxShadow:
      "0 0 0 2px rgba(99, 102, 241, 0.08)",
  },

  roleIcon: {
    width: "36px",
    height: "36px",
    flexShrink: 0,
    borderRadius: "9px",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
  },

  roleIconSelected: {
    background: "#e0e7ff",
  },

  roleContent: {
    flex: 1,
    minWidth: 0,
  },

  roleTitle: {
    fontSize: "12px",
    color: "#1e293b",
    fontWeight: "700",
    marginBottom: "2px",
  },

  roleDescription: {
    fontSize: "10px",
    color: "#64748b",
    lineHeight: "1.3",
  },

  radio: {
    width: "16px",
    height: "16px",
    flexShrink: 0,
    borderRadius: "50%",
    border: "1.5px solid #cbd5e1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  radioSelected: {
    borderColor: "#4f46e5",
  },

  radioDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#4f46e5",
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

  loginLink: {
    display: "block",
    textAlign: "center",
    color: "#4f46e5",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "13px",
  },

  terms: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "10px",
    lineHeight: "1.5",
    margin: "20px 0 0",
  },
};

export default Register;