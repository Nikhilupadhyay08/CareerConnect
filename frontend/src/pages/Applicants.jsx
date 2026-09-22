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
      setError("");

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

  const getStatusStyle = (status) => {
    switch (status) {
      case "Applied":
        return styles.statusApplied;

      case "Shortlisted":
        return styles.statusShortlisted;

      case "Rejected":
        return styles.statusRejected;

      case "Hired":
        return styles.statusHired;

      default:
        return styles.statusApplied;
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";

    const words = name.trim().split(" ");

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  const getStatusCount = (status) => {
    return applications.filter(
      (application) => application.status === status
    ).length;
  };

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>

          <h2 style={styles.loadingTitle}>
            Loading Applicants
          </h2>

          <p style={styles.loadingText}>
            Please wait while we load the candidates.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.backgroundShapeOne}></div>
      <div style={styles.backgroundShapeTwo}></div>

      <div style={styles.container}>
        {/* ================= HEADER ================= */}
        <section style={styles.header}>
          <div style={styles.headerTop}>
            <Link
              to="/employer/dashboard"
              style={styles.backLink}
            >
              ← Back to Dashboard
            </Link>

            <div style={styles.headerBadge}>
              👥 {applications.length}{" "}
              {applications.length === 1
                ? "Applicant"
                : "Applicants"}
            </div>
          </div>

          <div style={styles.headerMain}>
            <div>
              <span style={styles.eyebrow}>
                APPLICANTS
              </span>

              <h1 style={styles.pageTitle}>
                {job?.title || "Job Applicants"}
              </h1>

              {job && (
                <div style={styles.jobMeta}>
                  <span>🏢 {job.company}</span>

                  {job.location && (
                    <>
                      <span style={styles.metaDot}>•</span>
                      <span>📍 {job.location}</span>
                    </>
                  )}

                  {job.jobType && (
                    <>
                      <span style={styles.metaDot}>•</span>
                      <span>{job.jobType}</span>
                    </>
                  )}
                </div>
              )}

              <p style={styles.pageSubtitle}>
                Review candidates who applied for this
                position and manage their application
                status.
              </p>
            </div>

            <div style={styles.headerIcon}>
              👥
            </div>
          </div>
        </section>

        {/* ================= ERROR ================= */}
        {error && (
          <div style={styles.errorBox}>
            <div style={styles.errorIcon}>⚠</div>

            <div style={styles.errorContent}>
              <strong style={styles.errorTitle}>
                Something went wrong
              </strong>

              <p style={styles.errorText}>
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={fetchApplicants}
              style={styles.retryButton}
            >
              Try Again
            </button>
          </div>
        )}

        {/* ================= SUMMARY ================= */}
        {!error && applications.length > 0 && (
          <div style={styles.summaryGrid}>
            <div style={styles.summaryCard}>
              <div
                style={{
                  ...styles.summaryIcon,
                  background: "#eef2ff",
                  color: "#4f46e5",
                }}
              >
                👥
              </div>

              <div>
                <span style={styles.summaryLabel}>
                  Total
                </span>

                <strong style={styles.summaryValue}>
                  {applications.length}
                </strong>
              </div>
            </div>

            <div style={styles.summaryCard}>
              <div
                style={{
                  ...styles.summaryIcon,
                  background: "#eff6ff",
                  color: "#2563eb",
                }}
              >
                📄
              </div>

              <div>
                <span style={styles.summaryLabel}>
                  Applied
                </span>

                <strong style={styles.summaryValue}>
                  {getStatusCount("Applied")}
                </strong>
              </div>
            </div>

            <div style={styles.summaryCard}>
              <div
                style={{
                  ...styles.summaryIcon,
                  background: "#fff7ed",
                  color: "#ea580c",
                }}
              >
                ⭐
              </div>

              <div>
                <span style={styles.summaryLabel}>
                  Shortlisted
                </span>

                <strong style={styles.summaryValue}>
                  {getStatusCount("Shortlisted")}
                </strong>
              </div>
            </div>

            <div style={styles.summaryCard}>
              <div
                style={{
                  ...styles.summaryIcon,
                  background: "#f0fdf4",
                  color: "#16a34a",
                }}
              >
                ✓
              </div>

              <div>
                <span style={styles.summaryLabel}>
                  Hired
                </span>

                <strong style={styles.summaryValue}>
                  {getStatusCount("Hired")}
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* ================= EMPTY STATE ================= */}
        {!error && applications.length === 0 ? (
          <div style={styles.emptyCard}>
            <div style={styles.emptyIcon}>
              👥
            </div>

            <h2 style={styles.emptyTitle}>
              No applicants yet
            </h2>

            <p style={styles.emptyText}>
              Applications for this job will appear here
              when candidates apply.
            </p>

            <Link
              to="/employer/dashboard"
              style={styles.primaryButton}
            >
              ← Back to Dashboard
            </Link>
          </div>
        ) : (
          !error && (
            <section style={styles.applicantsSection}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionEyebrow}>
                    CANDIDATES
                  </span>

                  <h2 style={styles.sectionTitle}>
                    Applications
                  </h2>
                </div>

                <span style={styles.sectionCount}>
                  {applications.length} total
                </span>
              </div>

              <div style={styles.applicantsList}>
                {applications.map((application) => {
                  const applicantName =
                    application.applicant?.name ||
                    "Unknown Applicant";

                  const applicantEmail =
                    application.applicant?.email ||
                    "No email available";

                  return (
                    <article
                      key={application._id}
                      style={styles.applicantCard}
                    >
                      {/* CANDIDATE */}
                      <div style={styles.candidateInfo}>
                        <div style={styles.avatar}>
                          {getInitials(applicantName)}
                        </div>

                        <div style={styles.candidateDetails}>
                          <div style={styles.nameRow}>
                            <h3 style={styles.candidateName}>
                              {applicantName}
                            </h3>

                            <span
                              style={{
                                ...styles.statusBadge,
                                ...getStatusStyle(
                                  application.status
                                ),
                              }}
                            >
                              {application.status}
                            </span>
                          </div>

                          <p style={styles.email}>
                            ✉ {applicantEmail}
                          </p>

                          <p style={styles.appliedDate}>
                            Applied on{" "}
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
                          </p>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div style={styles.candidateActions}>
                        {application.resume && (
                          <div style={styles.resumeActions}>
                            <button
                              type="button"
                              onClick={() =>
                                handleViewResume(
                                  application._id
                                )
                              }
                              style={styles.viewResumeButton}
                            >
                              👁 View Resume
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDownloadResume(
                                  application._id
                                )
                              }
                              style={styles.downloadButton}
                            >
                              ↓ Download
                            </button>
                          </div>
                        )}

                        <div style={styles.statusControl}>
                          <label
                            htmlFor={`status-${application._id}`}
                            style={styles.statusLabel}
                          >
                            Application Status
                          </label>

                          <select
                            id={`status-${application._id}`}
                            value={application.status}
                            onChange={(event) =>
                              handleStatusChange(
                                application._id,
                                event.target.value
                              )
                            }
                            style={{
                              ...styles.statusSelect,
                              ...getStatusStyle(
                                application.status
                              ),
                            }}
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
              </div>
            </section>
          )
        )}

        {/* ================= FOOTER TIP ================= */}
        {!error && applications.length > 0 && (
          <div style={styles.tipCard}>
            <div style={styles.tipIcon}>
              💡
            </div>

            <div>
              <strong style={styles.tipTitle}>
                Managing applications
              </strong>

              <p style={styles.tipText}>
                Review each candidate's resume before
                updating their application status. Status
                changes are saved immediately.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "calc(100vh - 70px)",
    background:
      "linear-gradient(135deg, #f8fafc 0%, #eef2ff 52%, #f8fafc 100%)",
    position: "relative",
    overflow: "hidden",
    paddingBottom: "70px",
  },

  backgroundShapeOne: {
    position: "absolute",
    width: "520px",
    height: "520px",
    borderRadius: "50%",
    background: "rgba(99, 102, 241, 0.07)",
    top: "-280px",
    left: "-250px",
    pointerEvents: "none",
  },

  backgroundShapeTwo: {
    position: "absolute",
    width: "430px",
    height: "430px",
    borderRadius: "50%",
    background: "rgba(59, 130, 246, 0.05)",
    bottom: "-230px",
    right: "-230px",
    pointerEvents: "none",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "35px 24px 0",
    position: "relative",
    zIndex: 1,
  },

  header: {
    marginBottom: "22px",
  },

  headerTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "22px",
  },

  backLink: {
    display: "inline-flex",
    alignItems: "center",
    color: "#64748b",
    textDecoration: "none",
    fontSize: "12px",
    fontWeight: "700",
  },

  headerBadge: {
    padding: "8px 13px",
    borderRadius: "20px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    color: "#475569",
    fontSize: "11px",
    fontWeight: "700",
    boxShadow:
      "0 4px 12px rgba(15, 23, 42, 0.04)",
  },

  headerMain: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "25px",
  },

  eyebrow: {
    display: "inline-block",
    marginBottom: "6px",
    color: "#6366f1",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1.2px",
  },

  pageTitle: {
    margin: 0,
    color: "#111827",
    fontSize: "32px",
    lineHeight: "1.2",
    letterSpacing: "-0.7px",
    fontWeight: "800",
  },

  jobMeta: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "7px",
    marginTop: "8px",
    color: "#64748b",
    fontSize: "11px",
    fontWeight: "600",
  },

  metaDot: {
    color: "#cbd5e1",
  },

  pageSubtitle: {
    maxWidth: "650px",
    margin: "9px 0 0",
    color: "#94a3b8",
    fontSize: "12px",
    lineHeight: "1.6",
  },

  headerIcon: {
    width: "62px",
    height: "62px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, #eef2ff, #e0e7ff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
    boxShadow:
      "0 10px 25px rgba(79, 70, 229, 0.10)",
    flexShrink: 0,
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "13px",
    marginBottom: "22px",
  },

  summaryCard: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    padding: "15px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    boxShadow:
      "0 7px 22px rgba(15, 23, 42, 0.04)",
  },

  summaryIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
    flexShrink: 0,
  },

  summaryLabel: {
    display: "block",
    color: "#94a3b8",
    fontSize: "9px",
    fontWeight: "700",
    marginBottom: "2px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  summaryValue: {
    display: "block",
    color: "#1e293b",
    fontSize: "19px",
    fontWeight: "800",
  },

  applicantsSection: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "25px",
    boxShadow:
      "0 15px 40px rgba(15, 23, 42, 0.06)",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "18px",
    paddingBottom: "15px",
    borderBottom: "1px solid #eef2f7",
  },

  sectionEyebrow: {
    display: "block",
    marginBottom: "3px",
    color: "#6366f1",
    fontSize: "8px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  sectionTitle: {
    margin: 0,
    color: "#1e293b",
    fontSize: "19px",
    fontWeight: "800",
  },

  sectionCount: {
    padding: "6px 10px",
    borderRadius: "8px",
    background: "#f8fafc",
    color: "#64748b",
    fontSize: "10px",
    fontWeight: "700",
  },

  applicantsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  applicantCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    padding: "17px",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    background: "#ffffff",
    transition: "box-shadow 0.2s ease",
  },

  candidateInfo: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    minWidth: 0,
    flex: 1,
  },

  avatar: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background:
      "linear-gradient(135deg, #4f46e5, #2563eb)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
    fontWeight: "800",
    flexShrink: 0,
    boxShadow:
      "0 7px 16px rgba(79, 70, 229, 0.16)",
  },

  candidateDetails: {
    minWidth: 0,
  },

  nameRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "8px",
  },

  candidateName: {
    margin: 0,
    color: "#1e293b",
    fontSize: "14px",
    fontWeight: "800",
  },

  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 8px",
    borderRadius: "20px",
    fontSize: "9px",
    fontWeight: "800",
  },

  statusApplied: {
    background: "#eff6ff",
    color: "#2563eb",
  },

  statusShortlisted: {
    background: "#fff7ed",
    color: "#ea580c",
  },

  statusRejected: {
    background: "#fef2f2",
    color: "#dc2626",
  },

  statusHired: {
    background: "#f0fdf4",
    color: "#16a34a",
  },

  email: {
    margin: "5px 0 2px",
    color: "#64748b",
    fontSize: "10px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  appliedDate: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "9px",
  },

  candidateActions: {
    display: "flex",
    alignItems: "flex-end",
    gap: "15px",
    flexShrink: 0,
  },

  resumeActions: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
  },

  viewResumeButton: {
    border: "1px solid #c7d2fe",
    background: "#eef2ff",
    color: "#4f46e5",
    padding: "9px 12px",
    borderRadius: "8px",
    fontSize: "10px",
    fontWeight: "700",
    cursor: "pointer",
  },

  downloadButton: {
    border: "1px solid #dbe2ea",
    background: "#ffffff",
    color: "#475569",
    padding: "9px 12px",
    borderRadius: "8px",
    fontSize: "10px",
    fontWeight: "700",
    cursor: "pointer",
  },

  statusControl: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    minWidth: "145px",
  },

  statusLabel: {
    color: "#94a3b8",
    fontSize: "8px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  statusSelect: {
    border: "1px solid #dbe2ea",
    borderRadius: "8px",
    padding: "9px 10px",
    fontSize: "10px",
    fontWeight: "700",
    outline: "none",
    cursor: "pointer",
  },

  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    marginBottom: "20px",
    padding: "13px",
    borderRadius: "11px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
  },

  errorIcon: {
    width: "27px",
    height: "27px",
    borderRadius: "50%",
    background: "#fee2e2",
    color: "#dc2626",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "800",
    flexShrink: 0,
  },

  errorContent: {
    flex: 1,
  },

  errorTitle: {
    display: "block",
    color: "#991b1b",
    fontSize: "11px",
    marginBottom: "2px",
  },

  errorText: {
    margin: 0,
    color: "#b91c1c",
    fontSize: "10px",
  },

  retryButton: {
    border: "none",
    background: "#dc2626",
    color: "#ffffff",
    padding: "8px 12px",
    borderRadius: "8px",
    fontSize: "10px",
    fontWeight: "700",
    cursor: "pointer",
  },

  emptyCard: {
    padding: "65px 25px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    boxShadow:
      "0 15px 40px rgba(15, 23, 42, 0.05)",
    textAlign: "center",
  },

  emptyIcon: {
    width: "65px",
    height: "65px",
    margin: "0 auto 15px",
    borderRadius: "18px",
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "27px",
  },

  emptyTitle: {
    margin: 0,
    color: "#1e293b",
    fontSize: "20px",
    fontWeight: "800",
  },

  emptyText: {
    maxWidth: "400px",
    margin: "8px auto 20px",
    color: "#94a3b8",
    fontSize: "12px",
    lineHeight: "1.6",
  },

  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    background:
      "linear-gradient(135deg, #4f46e5, #2563eb)",
    color: "#ffffff",
    padding: "11px 17px",
    borderRadius: "9px",
    fontSize: "11px",
    fontWeight: "700",
    boxShadow:
      "0 7px 17px rgba(79, 70, 229, 0.18)",
  },

  tipCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    marginTop: "18px",
    padding: "15px 17px",
    borderRadius: "14px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
  },

  tipIcon: {
    fontSize: "17px",
  },

  tipTitle: {
    display: "block",
    color: "#334155",
    fontSize: "11px",
    marginBottom: "3px",
  },

  tipText: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "10px",
    lineHeight: "1.6",
  },

  loadingContainer: {
    maxWidth: "600px",
    margin: "100px auto",
    padding: "45px 30px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    boxShadow:
      "0 15px 45px rgba(15, 23, 42, 0.07)",
    textAlign: "center",
  },

  loadingSpinner: {
    width: "34px",
    height: "34px",
    margin: "0 auto 18px",
    border: "3px solid #e0e7ff",
    borderTopColor: "#4f46e5",
    borderRadius: "50%",
  },

  loadingTitle: {
    margin: 0,
    color: "#1e293b",
    fontSize: "18px",
    fontWeight: "800",
  },

  loadingText: {
    margin: "7px 0 0",
    color: "#94a3b8",
    fontSize: "12px",
  },
};

export default Applicants;