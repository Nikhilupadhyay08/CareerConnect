import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getJobById,
  getJobApplicants,
  updateApplicationStatus,
} from "../services/api";

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

  if (loading) {
    return (
      <main className="applicants-page">
        <div className="applicants-container">
          <div className="applicants-loading">
            Loading applicants...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="applicants-page">
      <div className="applicants-container">
        <div className="applicants-header">
          <div>
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

            <p>
              Review candidates who applied for this
              position.
            </p>
          </div>

          <div className="applicant-count">
            <strong>{applications.length}</strong>
            <span>
              {applications.length === 1
                ? "Applicant"
                : "Applicants"}
            </span>
          </div>
        </div>

        {error && (
          <div className="applicants-error">
            {error}
          </div>
        )}

        {applications.length === 0 ? (
          <div className="applicants-empty">
            <div className="empty-icon">👥</div>

            <h2>No applicants yet</h2>

            <p>
              Applications for this job will appear
              here when candidates apply.
            </p>
          </div>
        ) : (
          <div className="applicants-list">
            {applications.map((application) => (
              <div
                className="applicant-card"
                key={application._id}
              >
                <div className="applicant-main">
                  <div className="applicant-avatar">
                    {application.applicant?.name
                      ?.charAt(0)
                      ?.toUpperCase() || "A"}
                  </div>

                  <div className="applicant-info">
                    <h2>
                      {application.applicant?.name ||
                        "Unknown Applicant"}
                    </h2>

                    <p>
                      {application.applicant?.email ||
                        "No email available"}
                    </p>

                    <span>
                      Applied on{" "}
                      {new Date(
                        application.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="applicant-actions">
                  {application.resume && (
                    <a
                      href={application.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="secondary-button"
                    >
                      View Resume
                    </a>
                  )}

                  <select
                    value={application.status}
                    onChange={(event) =>
                      handleStatusChange(
                        application._id,
                        event.target.value
                      )
                    }
                    className={`status-select status-${application.status.toLowerCase()}`}
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
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Applicants;