import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyJobs, deleteJob } from "../services/api";

function EmployerDashboard() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch employer's jobs
  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyJobs(token);

      setJobs(data.jobs || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMyJobs();
    }
  }, [token]);

  // Delete job
  const handleDelete = async (jobId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteJob(token, jobId);

      setJobs((currentJobs) =>
        currentJobs.filter((job) => job._id !== jobId)
      );
    } catch (error) {
      setError(error.message);
    }
  };

  // Statistics
  const totalJobs = jobs.length;

  const fullTimeJobs = jobs.filter(
    (job) => job.jobType === "Full-time"
  ).length;

  const internshipJobs = jobs.filter(
    (job) => job.jobType === "Internship"
  ).length;

  return (
    <main className="employer-dashboard-page">
      <div className="employer-dashboard-container">

        {/* Dashboard Header */}
        <section className="employer-dashboard-header">
          <div>
            <span className="section-label">
              EMPLOYER DASHBOARD
            </span>

            <h1>
              Welcome back, {user?.name}
            </h1>

            <p>
              Manage your job postings and connect with
              talented candidates.
            </p>
          </div>

          <button
            className="primary-button employer-create-button"
            onClick={() =>
              navigate("/employer/create-job")
            }
          >
            + Post a New Job
          </button>
        </section>

        {/* Statistics */}
        <section className="employer-stats">

          <div className="employer-stat-card">
            <div className="employer-stat-icon">
              💼
            </div>

            <div>
              <span>Total Jobs</span>
              <strong>{totalJobs}</strong>
            </div>
          </div>

          <div className="employer-stat-card">
            <div className="employer-stat-icon">
              🏢
            </div>

            <div>
              <span>Full-time Jobs</span>
              <strong>{fullTimeJobs}</strong>
            </div>
          </div>

          <div className="employer-stat-card">
            <div className="employer-stat-icon">
              🎓
            </div>

            <div>
              <span>Internships</span>
              <strong>{internshipJobs}</strong>
            </div>
          </div>

        </section>

        {/* Posted Jobs */}
        <section className="employer-jobs-section">

          <div className="employer-section-heading">
            <div>
              <h2>My Posted Jobs</h2>

              <p>
                Manage your current job openings.
              </p>
            </div>

            <span className="employer-job-count">
              {totalJobs}{" "}
              {totalJobs === 1 ? "Job" : "Jobs"}
            </span>
          </div>

          {/* Loading */}
          {loading && (
            <div className="employer-message">
              <div className="loading-spinner"></div>

              <p>Loading your jobs...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="employer-message error-message">
              <h3>Unable to load jobs</h3>

              <p>{error}</p>

              <button
                onClick={fetchMyJobs}
                className="primary-button"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading &&
            !error &&
            jobs.length === 0 && (
              <div className="employer-message employer-empty">

                <div className="employer-empty-icon">
                  💼
                </div>

                <h3>No jobs posted yet</h3>

                <p>
                  Create your first job posting and start
                  finding talented candidates.
                </p>

                <button
                  className="primary-button"
                  onClick={() =>
                    navigate("/employer/create-job")
                  }
                >
                  + Create Your First Job
                </button>

              </div>
            )}

          {/* Jobs */}
          {!loading &&
            !error &&
            jobs.length > 0 && (
              <div className="employer-job-list">

                {jobs.map((job) => (
                  <article
                    className="employer-job-card"
                    key={job._id}
                  >

                    {/* Job Header */}
                    <div className="employer-job-header">

                      <div className="employer-job-title">

                        <div className="employer-company-icon">
                          {job.company
                            ? job.company
                                .charAt(0)
                                .toUpperCase()
                            : "C"}
                        </div>

                        <div>
                          <h3>{job.title}</h3>

                          <p>{job.company}</p>
                        </div>

                      </div>

                      <span className="job-type-badge">
                        {job.jobType}
                      </span>

                    </div>

                    {/* Job Meta */}
                    <div className="employer-job-meta">

                      <span>
                        📍 {job.location}
                      </span>

                      <span>
                        💰 {job.salary}
                      </span>

                      <span>
                        📅 Posted recently
                      </span>

                    </div>

                    {/* Description */}
                    <p className="employer-job-description">
                      {job.description}
                    </p>

                    {/* Requirements */}
                    {job.requirements &&
                      job.requirements.length > 0 && (
                        <div className="employer-job-skills">

                          {job.requirements
                            .slice(0, 5)
                            .map((requirement, index) => (
                              <span key={index}>
                                {requirement}
                              </span>
                            ))}

                        </div>
                      )}

                    {/* Actions */}
                    <div className="employer-job-footer">

                      <Link
                        to={`/jobs/${job._id}`}
                        className="employer-view-button"
                      >
                        View Job
                      </Link>

                      <div className="employer-job-actions">

                        <button
                          className="employer-edit-button"
                          onClick={() =>
                            navigate(
                              `/employer/edit-job/${job._id}`
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="employer-applicants-button"
                          onClick={() =>
                            navigate(
                              `/employer/job/${job._id}/applicants`
                            )
                          }
                        >
                          Applicants
                        </button>

                        <button
                          className="employer-delete-button"
                          onClick={() =>
                            handleDelete(job._id)
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </article>
                ))}

              </div>
            )}

        </section>

        {/* Bottom CTA */}
        <section className="employer-dashboard-cta">

          <div>
            <span className="section-label">
              BUILD YOUR TEAM
            </span>

            <h2>
              Looking for talented candidates?
            </h2>

            <p>
              Post a new opportunity and connect with
              skilled job seekers on CareerConnect.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() =>
              navigate("/employer/create-job")
            }
          >
            Post a Job →
          </button>

        </section>

      </div>
    </main>
  );
}

export default EmployerDashboard;