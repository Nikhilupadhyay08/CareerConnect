import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyApplications } from "../services/api";

function JobSeekerDashboard() {
  const { token, user } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch applications
  const fetchApplications = async () => {
  try {
    setLoading(true);
    setError("");

    const data = await getMyApplications(token);

    setApplications(data.applications || []);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (token) {
      fetchApplications();
    }
  }, [token]);

  // Count applications by status
  const totalApplications = applications.length;

  const appliedCount = applications.filter(
    (application) => application.status === "Applied"
  ).length;

  const shortlistedCount = applications.filter(
    (application) => application.status === "Shortlisted"
  ).length;

  const hiredCount = applications.filter(
    (application) => application.status === "Hired"
  ).length;

  const rejectedCount = applications.filter(
    (application) => application.status === "Rejected"
  ).length;

  // Get status class
  const getStatusClass = (status) => {
    switch (status) {
      case "Applied":
        return "status-applied";

      case "Shortlisted":
        return "status-shortlisted";

      case "Rejected":
        return "status-rejected";

      case "Hired":
        return "status-hired";

      default:
        return "";
    }
  };

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        {/* Dashboard Header */}
        <section className="dashboard-header">
          <div>
            <span className="section-label">
              JOB SEEKER DASHBOARD
            </span>

            <h1>
              Welcome back, {user?.name}
            </h1>

            <p>
              Track your applications and manage your job search
              from one place.
            </p>
          </div>

          <Link
            to="/jobs"
            className="primary-button"
          >
            Browse Jobs
          </Link>
        </section>

        {/* Statistics */}
        <section className="dashboard-stats">

          <div className="stat-card">
            <div className="stat-icon">
              📄
            </div>

            <div>
              <span>Total Applications</span>
              <strong>{totalApplications}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              📤
            </div>

            <div>
              <span>Applied</span>
              <strong>{appliedCount}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              ⭐
            </div>

            <div>
              <span>Shortlisted</span>
              <strong>{shortlistedCount}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              ❌
            </div>

            <div>
              <span>Rejected</span>
              <strong>{rejectedCount}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              🎉
            </div>

            <div>
              <span>Hired</span>
              <strong>{hiredCount}</strong>
            </div>
          </div>

        </section>

        {/* Applications Section */}
        <section className="applications-section">

          <div className="section-heading-row">
            <div>
              <h2>My Applications</h2>

              <p>
                Keep track of the jobs you have applied for.
              </p>
            </div>

            <span className="application-count">
              {totalApplications}{" "}
              {totalApplications === 1
                ? "Application"
                : "Applications"}
            </span>
          </div>

          {/* Loading */}
          {loading && (
            <div className="dashboard-message">
              <div className="loading-spinner"></div>

              <p>Loading your applications...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="dashboard-message error-message">
              <h3>Unable to load applications</h3>

              <p>{error}</p>

              <button
                onClick={fetchApplications}
                className="primary-button"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading &&
            !error &&
            applications.length === 0 && (
              <div className="dashboard-message empty-dashboard">

                <div className="empty-dashboard-icon">
                  📋
                </div>

                <h3>No applications yet</h3>

                <p>
                  You haven't applied for any jobs yet.
                  Start exploring opportunities and submit
                  your first application.
                </p>

                <Link
                  to="/jobs"
                  className="primary-button"
                >
                  Explore Jobs
                </Link>

              </div>
            )}

          {/* Applications */}
          {!loading &&
            !error &&
            applications.length > 0 && (
              <div className="applications-list">

                {applications.map((application) => {
                  const job = application.job;

                  return (
                    <article
                      className="application-card"
                      key={application._id}
                    >

                      {/* Application Header */}
                      <div className="application-card-header">

                        <div className="application-company">

                          <div className="application-company-icon">
                            {job?.company
                              ? job.company
                                  .charAt(0)
                                  .toUpperCase()
                              : "C"}
                          </div>

                          <div>
                            <h3>
                              {job
                                ? job.title
                                : "Job no longer available"}
                            </h3>

                            {job && (
                              <p>
                                {job.company}
                              </p>
                            )}
                          </div>

                        </div>

                        <span
                          className={`application-status ${getStatusClass(
                            application.status
                          )}`}
                        >
                          {application.status}
                        </span>

                      </div>

                      {/* Job Information */}
                      {job && (
                        <div className="application-meta">

                          <span>
                            📍 {job.location}
                          </span>

                          <span>
                            💼 {job.jobType}
                          </span>

                          <span>
                            💰 {job.salary}
                          </span>

                        </div>
                      )}

                      {/* Application Details */}
                      <div className="application-details">

                        <div>
                          <span>Applied on</span>

                          <strong>
                            {new Date(
                              application.createdAt
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>Application Status</span>

                          <strong>
                            {application.status}
                          </strong>
                        </div>

                      </div>

                      {/* Actions */}
                      <div className="application-card-footer">

                        <div className="application-actions">

                          {job && (
                            <Link
                              to={`/jobs/${job._id}`}
                              className="view-application-button"
                            >
                              View Job →
                            </Link>
                          )}

                          {application.resume && (
                            <a
                              href={application.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="resume-button"
                            >
                              View Resume
                            </a>
                          )}

                        </div>

                      </div>

                    </article>
                  );
                })}

              </div>
            )}

        </section>

        {/* Bottom CTA */}
        <section className="dashboard-cta">

          <div>
            <span className="section-label">
              KEEP GOING
            </span>

            <h2>
              Looking for your next opportunity?
            </h2>

            <p>
              Explore more jobs and find a position that
              matches your skills and career goals.
            </p>
          </div>

          <Link
            to="/jobs"
            className="primary-button"
          >
            Find More Jobs →
          </Link>

        </section>

      </div>
    </main>
  );
}

export default JobSeekerDashboard;