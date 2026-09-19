import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser(formData);

      login(data);

      if (data.user.role === "employer") {
        navigate("/employer/dashboard");
      } else {
        navigate("/jobseeker/dashboard");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-shell">

        {/* ================= LEFT BRAND PANEL ================= */}

        <section className="login-visual">

          <div className="visual-glow visual-glow-one"></div>
          <div className="visual-glow visual-glow-two"></div>

          <div className="visual-content">

            <div className="brand-mark">
              C
            </div>

            <div className="brand-name">
              Career<span>Connect</span>
            </div>

            <div className="visual-line"></div>

            <p className="eyebrow">
              YOUR CAREER. YOUR NEXT MOVE.
            </p>

            <h1>
              Turn opportunities
              <br />
              into <span>possibilities.</span>
            </h1>

            <p className="visual-description">
              Discover meaningful opportunities, connect with employers,
              and take the next step toward the career you want.
            </p>

            <div className="trust-row">
              <div className="trust-item">
                <strong>01</strong>
                <span>Discover</span>
              </div>

              <div className="trust-divider"></div>

              <div className="trust-item">
                <strong>02</strong>
                <span>Connect</span>
              </div>

              <div className="trust-divider"></div>

              <div className="trust-item">
                <strong>03</strong>
                <span>Grow</span>
              </div>
            </div>

          </div>

          <div className="visual-footer">
            <span>CareerConnect</span>
            <span>Build what comes next.</span>
          </div>

        </section>

        {/* ================= LOGIN PANEL ================= */}

        <section className="login-panel">

          <div className="login-card">

            <div className="mobile-brand">
              <div className="mobile-brand-mark">C</div>
              <span>CareerConnect</span>
            </div>

            <div className="login-heading">
              <span className="heading-label">
                ACCOUNT ACCESS
              </span>

              <h2>
                Welcome back<span>.</span>
              </h2>

              <p>
                Sign in to continue your career journey.
              </p>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="field-group">
                <label htmlFor="email">
                  Email address
                </label>

                <div className="input-container">

                  <svg
                    className="field-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="2"
                    />
                    <path d="m3 7 9 6 9-6" />
                  </svg>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    autoComplete="email"
                    required
                  />

                </div>
              </div>

              <div className="field-group">
                <div className="password-label-row">
                  <label htmlFor="password">
                    Password
                  </label>
                </div>

                <div className="input-container">

                  <svg
                    className="field-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect
                      x="4"
                      y="10"
                      width="16"
                      height="11"
                      rx="2"
                    />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>

                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />

                </div>
              </div>

              {error && (
                <div className="login-error">
                  <span className="error-symbol">!</span>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="signin-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="button-spinner"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    <span>Sign in</span>

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14" />
                      <path d="m13 6 6 6-6 6" />
                    </svg>
                  </>
                )}
              </button>

            </form>

            <div className="login-divider">
              <span>NEW TO CAREERCONNECT?</span>
            </div>

            <Link
              to="/register"
              className="create-account"
            >
              <span>Create your account</span>

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </Link>

            <p className="login-footer">
              By continuing, you agree to use CareerConnect
              responsibly and professionally.
            </p>

          </div>

        </section>

      </div>
    </main>
  );
}

export default Login;