import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const data = await forgotPassword(email.trim());

      setMessage(
        data.message ||
          "If an account exists with this email, a password reset link has been sent."
      );

      setEmail("");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>🔐</div>

        <h1 style={styles.title}>Forgot Password?</h1>

        <p style={styles.subtitle}>
          Enter your registered email address and we'll send you a link to
          reset your password.
        </p>

        {message && <div style={styles.success}>{message}</div>}

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              autoComplete="email"
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
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

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
  },

  error: {
    marginBottom: "20px",
    padding: "12px 14px",
    borderRadius: "8px",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    fontSize: "14px",
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

export default ForgotPassword;