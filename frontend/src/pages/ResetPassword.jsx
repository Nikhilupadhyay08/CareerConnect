import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../services/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
      setError("Invalid or missing password reset token.");
      return;
    }

    try {
      setLoading(true);

      const data = await resetPassword(token, password);

      setMessage(
        data.message || "Password reset successful. You can now log in."
      );

      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err.message ||
          "The reset link is invalid or has expired. Please request a new one."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>🔑</div>

        <h1 style={styles.title}>Reset Password</h1>

        <p style={styles.subtitle}>
          Enter your new password below.
        </p>

        {message && <div style={styles.success}>{message}</div>}

        {error && <div style={styles.error}>{error}</div>}

        {!message && (
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="password" style={styles.label}>
                New Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                autoComplete="new-password"
                disabled={loading}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="confirmPassword" style={styles.label}>
                Confirm New Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.input}
                autoComplete="new-password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : {}),
              }}
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <div style={styles.back}>
          <Link to="/login" style={styles.link}>
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "calc(100vh - 140px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
    backgroundColor: "#f8fafc",
  },

  card: {
    width: "100%",
    maxWidth: "450px",
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e5e7eb",
  },

  icon: {
    width: "60px",
    height: "60px",
    margin: "0 auto 20px",
    borderRadius: "50%",
    backgroundColor: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
  },

  title: {
    margin: "0 0 10px",
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    margin: "0 0 28px",
    textAlign: "center",
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#6b7280",
  },

  formGroup: {
    marginBottom: "20px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "15px",
    outline: "none",
    color: "#111827",
    backgroundColor: "#ffffff",
  },

  button: {
    width: "100%",
    padding: "13px 16px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },

  buttonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },

  success: {
    marginBottom: "20px",
    padding: "12px 14px",
    borderRadius: "8px",
    backgroundColor: "#ecfdf5",
    color: "#047857",
    border: "1px solid #a7f3d0",
    fontSize: "14px",
    lineHeight: "1.5",
    textAlign: "center",
  },

  error: {
    marginBottom: "20px",
    padding: "12px 14px",
    borderRadius: "8px",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  back: {
    marginTop: "24px",
    textAlign: "center",
  },

  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
  },
};

export default ResetPassword;