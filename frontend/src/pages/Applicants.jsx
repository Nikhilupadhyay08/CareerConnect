import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getJobById,
  getJobApplicants,
  updateApplicationStatus,
} from "../services/api";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000/api";

function Applicants() {
  const { jobId } = useParams();
  const { token } = useAuth();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      setError("");

      const [jobData, applicationData] = await Promise.all([
        getJobById(jobId),
        getJobApplicants(token, jobId),
      ]);

      setJob(jobData);
      setApplications(applicationData.applications || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && jobId) {
      fetchApplicants();
    }
  }, [token, jobId]);

  const handleStatusChange = async (applicationId, status) => {
    try {
      setError("");

      await updateApplicationStatus(
        token,
        applicationId,
        status
      );

      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application._id === applicationId
            ? {
                ...application,
                status,
              }
            : application
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleViewResume = async (applicationId) => {
  const newTab = window.open("", "_blank");

  if (!newTab) {
    setError("Please allow pop-ups to view the resume.");
    return;
  }

  try {
    setError("");

    const response = await fetch(
      `${API_URL}/applications/${applicationId}/resume/view`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to open resume");
    }

    const blob = await response.blob();

    const resumeUrl = URL.createObjectURL(blob);

    newTab.location.href = resumeUrl;

    setTimeout(() => {
      URL.revokeObjectURL(resumeUrl);
    }, 60000);
  } catch (error) {
    newTab.close();
    setError(error.message);
  }
};

const handleDownloadResume = async (applicationId) => {
  try {
    const response = await fetch(
      `${API_URL}/applications/${applicationId}/resume/download`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to download resume");
    }

    const blob = await response.blob();

    const resumeUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = resumeUrl;
    link.download = "resume.pdf";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(resumeUrl);
  } catch (error) {
    setError(error.message);
  }
};

  const getStatusClass = (status) => {
    switch (status) {
      case "Applied":
        return "applicant-status-applied";

      case "Shortlisted":
        return "applicant-status-shortlisted";

      case "Rejected":
        return "applicant-status-rejected";

      case "Hired":
        return "applicant-status-hired";

      default:
        return "";
    }
  };

  if (loading) {
    return (
      <main className="applicants-page">
        <div className="applicants-container">
          <div className="applicants-loading">
            <div className="loading-spinner"></div>
            <p>Loading applicants...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="applicants-page">
      <div className="applicants-container">

        {/* Header */}
        <section className="applicants-header">

          <div className="applicants-header-content">

            <Link
              to="/employer/dashboard"
              className="back-link"
            >
              ← Back to Dashboard
            </Link>

            <span className="section-label">
              APPLICANTS
            </span>

            <h1>
              {job?.title || "Job Applicants"}
            </h1>

            {job && (
              <p className="applicants-job-company">
                {job.company}
                {job.location && (
                  <> · {job.location}</>
                )}
              </p>
            )}

            <p>
              Review candidates who applied for this
              position and manage their application status.
            </p>

          </div>

          {/* Applicant Count */}
          <div className="applicant-count">
            <strong>{applications.length}</strong>

            <span>
              {applications.length === 1
                ? "Applicant"
                : "Applicants"}
            </span>
          </div>

        </section>

        {/* Error */}
        {error && (
          <div className="applicants-error">
            <strong>Something went wrong</strong>
            <p>{error}</p>

            <button
              onClick={fetchApplicants}
              className="primary-button"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!error && applications.length === 0 ? (
          <div className="applicants-empty">

            <div className="empty-icon">
              👥
            </div>

            <h2>No applicants yet</h2>

            <p>
              Applications for this job will appear
              here when candidates apply.
            </p>

            <Link
              to="/employer/dashboard"
              className="primary-button"
            >
              Back to Dashboard
            </Link>

          </div>
        ) : (
          /* Applicants List */
          !error && (
            <section className="applicants-list">

              {applications.map((application) => {

                const applicantName =
                  application.applicant?.name ||
                  "Unknown Applicant";

                const applicantEmail =
                  application.applicant?.email ||
                  "No email available";

                return (
                  <article
                    className="applicant-card"
                    key={application._id}
                  >

                    {/* Candidate Information */}
                    <div className="applicant-main">

                      <div className="applicant-avatar">
                        {applicantName
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="applicant-info">

                        <div className="applicant-name-row">
                          <h2>
                            {applicantName}
                          </h2>

                          <span
                            className={`applicant-status ${getStatusClass(
                              application.status
                            )}`}
                          >
                            {application.status}
                          </span>
                        </div>

                        <p className="applicant-email">
                          {applicantEmail}
                        </p>

                        <span className="applicant-date">
                          Applied on{" "}
                          {new Date(
                            application.createdAt
                          ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>

                      </div>

                    </div>

                    {/* Actions */}
                    <div className="applicant-actions">

                      {application.resume && (
                        <div className="resume-actions">
                          <button
                            type="button"
                            onClick={() =>
                              handleViewResume(application._id)
                            }
                            className="secondary-button"
                          >
                            👁 View Resume
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDownloadResume(application._id)
                            }
                            className="download-resume-button"
                          >
                            ↓ Download
                          </button>
                        </div>
                      )}

                      <div className="status-control">

                        <label>
                          Application Status
                        </label>

                        <select
                          value={application.status}
                          onChange={(event) =>
                            handleStatusChange(
                              application._id,
                              event.target.value
                            )
                          }
                          className={`status-select ${getStatusClass(
                            application.status
                          )}`}
                        >
                          <option value="Applied">
                            Applied
                          </option>

                          <option value="Shortlisted">
                            Shortlisted
                          </option>

                          <option value="Rejected">
                            Rejected
                          </option>

                          <option value="Hired">
                            Hired
                          </option>
                        </select>

                      </div>

                    </div>

                  </article>
                );
              })}

            </section>
          )
        )}

      </div>
    </main>
  );
}

export default Applicants;