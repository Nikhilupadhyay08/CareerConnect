import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getJobById, applyForJob } from "../services/api";
import { useAuth } from "../context/AuthContext";

function JobDetails() {
  const { id } = useParams();
  const { user, token } = useAuth();

  const [job, setJob] = useState(null);
  const [resume, setResume] = useState(null);

  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getJobById(id);

        setJob(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  // Handle resume selection
  const handleResumeChange = (event) => {
    const selectedFile = event.target.files[0];

    setResume(selectedFile || null);
    setError("");
    setSuccess("");
  };

  // Apply for job
  const handleApply = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!resume) {
      setError("Please select your resume PDF.");
      return;
    }

    if (resume.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    if (resume.size > 5 * 1024 * 1024) {
      setError("Resume must be less than 5 MB.");
      return;
    }

    try {
      setApplying(true);

      await applyForJob(token, id, resume);

      setSuccess("Application submitted successfully!");
      setResume(null);

      event.target.reset();
    } catch (error) {
      setError(error.message);
    } finally {
      setApplying(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <main className="job-details-page">
        <div className="job-details-loading">
          <div className="loading-spinner"></div>
          <p>Loading job details...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error && !job) {
    return (
      <main className="job-details-page">
        <div className="job-details-message error-message">
          <h2>Unable to load job</h2>

          <p>{error}</p>

          <Link to="/jobs" className="primary-button">
            ← Back to Jobs
          </Link>
        </div>
      </main>
    );
  }

  // Job not found
  if (!job) {
    return (
      <main className="job-details-page">
        <div className="job-details-message">
          <h2>Job not found</h2>

          <p>
            The job you are looking for may have been removed or
            is no longer available.
          </p>

          <Link to="/jobs" className="primary-button">
            ← Back to Jobs
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="job-details-page">
      <div className="job-details-container">

        {/* Back Button */}
        <Link to="/jobs" className="back-to-jobs">
          ← Back to Jobs
        </Link>

        {/* Job Header */}
        <section className="job-details-header">
          <div className="job-header-content">

            <div className="job-details-company-icon">
              {job.company
                ? job.company.charAt(0).toUpperCase()
                : "C"}
            </div>

            <div className="job-header-info">
              <div className="job-header-top">
                <span className="job-type-badge">
                  {job.jobType}
                </span>
              </div>

              <h1>{job.title}</h1>

              <p className="job-details-company">
                {job.company}
              </p>

              <div className="job-header-meta">
                <span>📍 {job.location}</span>
                <span>💰 {job.salary}</span>
              </div>
            </div>

          </div>
        </section>

        {/* Main Content */}
        <section className="job-details-content">

          <div className="job-details-grid">

            {/* Left Column */}
            <div className="job-details-main">

              {/* Description */}
              <div className="details-card">
                <h2>Job Description</h2>

                <p className="job-details-description">
                  {job.description}
                </p>
              </div>

              {/* Requirements */}
              <div className="details-card">
                <h2>Requirements</h2>

                {job.requirements &&
                job.requirements.length > 0 ? (
                  <ul className="requirements-list">
                    {job.requirements.map(
                      (requirement, index) => (
                        <li key={index}>
                          <span className="requirement-check">
                            ✓
                          </span>

                          {requirement}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="details-muted">
                    No specific requirements listed.
                  </p>
                )}
              </div>

              {/* Employer */}
              {job.employer && (
                <div className="details-card">
                  <h2>About the Employer</h2>

                  <div className="employer-info">

                    <div className="employer-avatar">
                      {job.employer.name
                        ? job.employer.name
                            .charAt(0)
                            .toUpperCase()
                        : "E"}
                    </div>

                    <div>
                      <h3>{job.employer.name}</h3>

                      <p>{job.employer.email}</p>

                      <span>Verified Employer</span>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <aside className="job-details-sidebar">

              {/* Job Summary */}
              <div className="details-card job-summary-card">
                <h2>Job Summary</h2>

                <div className="summary-item">
                  <span>Job Type</span>
                  <strong>{job.jobType}</strong>
                </div>

                <div className="summary-item">
                  <span>Location</span>
                  <strong>{job.location}</strong>
                </div>

                <div className="summary-item">
                  <span>Salary</span>
                  <strong>{job.salary}</strong>
                </div>
              </div>

              {/* Apply Section */}
              {user?.role === "jobseeker" && (
                <div className="details-card apply-card">

                  <div className="apply-card-icon">
                    📄
                  </div>

                  <h2>Apply for this Job</h2>

                  <p>
                    Upload your latest resume to apply for this
                    position.
                  </p>

                  <form onSubmit={handleApply}>

                    <label
                      htmlFor="resume"
                      className="resume-label"
                    >
                      Resume
                    </label>

                    <div className="resume-upload">
                      <input
                        id="resume"
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleResumeChange}
                      />

                      <span>
                        {resume
                          ? resume.name
                          : "Choose PDF resume"}
                      </span>
                    </div>

                    <p className="resume-help">
                      PDF only • Maximum 5 MB
                    </p>

                    <button
                      type="submit"
                      className="primary-button apply-button"
                      disabled={applying}
                    >
                      {applying
                        ? "Submitting..."
                        : "Apply for Job"}
                    </button>

                  </form>

                  {success && (
                    <div className="success-message">
                      ✓ {success}
                    </div>
                  )}

                  {error && (
                    <div className="form-error-message">
                      {error}
                    </div>
                  )}
                </div>
              )}

              {/* Logged out user */}
              {!user && (
                <div className="details-card apply-card">

                  <div className="apply-card-icon">
                    🔐
                  </div>

                  <h2>Interested in this Job?</h2>

                  <p>
                    Login or create an account to apply for this
                    position.
                  </p>

                  <Link
                    to="/login"
                    className="primary-button apply-button"
                  >
                    Login to Apply
                  </Link>

                  <Link
                    to="/register"
                    className="secondary-button apply-button"
                  >
                    Create Account
                  </Link>

                </div>
              )}

              {/* Employer notice */}
              {user?.role === "employer" && (
                <div className="details-card employer-notice">

                  <div className="apply-card-icon">
                    💼
                  </div>

                  <h2>Employer Account</h2>

                  <p>
                    You are viewing this job as an employer.
                    Job applications are available to job seekers.
                  </p>

                </div>
              )}

            </aside>

          </div>
        </section>

      </div>
    </main>
  );
}

export default JobDetails;