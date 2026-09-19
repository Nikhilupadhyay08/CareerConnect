import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <main className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">
            🚀 Find your next opportunity
          </span>

          <h1>
            Find a job you
            <span> actually want.</span>
          </h1>

          <p>
            Discover opportunities, connect with employers, and take
            the next step in your career with CareerConnect.
          </p>

          <div className="hero-buttons">
            <Link to="/jobs" className="primary-button">
              Explore Jobs
            </Link>

            {!isAuthenticated && (
              <Link to="/register" className="secondary-button">
                Create Account
              </Link>
            )}

            {isAuthenticated && (
              <Link
                to={
                  user?.role === "employer"
                    ? "/employer/dashboard"
                    : "/jobseeker/dashboard"
                }
                className="secondary-button"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>

        <div className="hero-card">
          <div className="hero-card-icon">💼</div>

          <h3>Build your career</h3>

          <p>
            Search for jobs, apply with your resume, and track your
            applications in one place.
          </p>

          <div className="hero-stat-row">
            <div>
              <strong>100+</strong>
              <span>Opportunities</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-heading">
          <span>WHY CAREERCONNECT?</span>

          <h2>Everything you need for your job search</h2>

          <p>
            A simple platform designed to connect talented people with
            the right opportunities.
          </p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">🔎</div>

            <h3>Find Jobs</h3>

            <p>
              Search and filter jobs by title, company, location, and
              job type.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📄</div>

            <h3>Easy Applications</h3>

            <p>
              Upload your resume and apply for jobs through a simple
              application process.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>

            <h3>Track Applications</h3>

            <p>
              Keep track of your applications and see their current
              status from your dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Employer Section */}
      <section className="employer-section">
        <div>
          <span className="section-label">FOR EMPLOYERS</span>

          <h2>Find the right talent for your team.</h2>

          <p>
            Create job openings, manage applicants, review resumes,
            and update application statuses from one dashboard.
          </p>
        </div>

        <Link
          to={
            user?.role === "employer"
              ? "/employer/create-job"
              : "/register"
          }
          className="primary-button"
        >
          {user?.role === "employer"
            ? "Post a Job"
            : "Join as Employer"}
        </Link>
      </section>

      {/* Call To Action */}
      {!isAuthenticated && (
        <section className="cta-section">
          <h2>Ready to take the next step?</h2>

          <p>
            Create your CareerConnect account and start exploring
            opportunities today.
          </p>

          <Link to="/register" className="primary-button">
            Get Started
          </Link>
        </section>
      )}
    </main>
  );
}

export default Home;