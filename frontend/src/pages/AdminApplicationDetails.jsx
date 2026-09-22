import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const AdminApplicationDetails = () => {
  const { id } = useParams();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await fetch(
          `${API_URL}/admin/applications`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch application details"
          );
        }

        const foundApplication = (
          data.applications || []
        ).find((item) => item._id === id);

        if (!foundApplication) {
          throw new Error("Application not found");
        }

        setApplication(foundApplication);
      } catch (error) {
        setError(
          error.message ||
            "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatDateTime = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
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
        return styles.statusDefault;
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loading}>
            Loading application details...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.error}>
            {error}
          </div>

          <Link
            to="/admin/applications"
            style={styles.backLink}
          >
            ← Back to Applications
          </Link>
        </div>
      </div>
    );
  }

  if (!application) {
    return null;
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Back */}
        <Link
          to="/admin/applications"
          style={styles.backLink}
        >
          ← Back to Applications
        </Link>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <p style={styles.label}>
              ADMIN PANEL
            </p>

            <h1 style={styles.title}>
              Application Details
            </h1>

            <p style={styles.subtitle}>
              Review application information,
              applicant details, and job information.
            </p>
          </div>

          <span
            style={getStatusStyle(
              application.status
            )}
          >
            {application.status || "Unknown"}
          </span>
        </div>

        {/* Applicant + Job */}
        <div style={styles.grid}>

          {/* Applicant */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              Applicant Information
            </h2>

            <div style={styles.profileBox}>
              <div style={styles.avatar}>
                {application.applicant?.name
                  ?.charAt(0)
                  ?.toUpperCase() || "U"}
              </div>

              <div>
                <div style={styles.name}>
                  {application.applicant?.name ||
                    "N/A"}
                </div>

                <div style={styles.email}>
                  {application.applicant?.email ||
                    "N/A"}
                </div>
              </div>
            </div>

            <div style={styles.infoList}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>
                  Applicant ID
                </span>

                <span style={styles.idValue}>
                  {application.applicant?._id ||
                    "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Job */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              Job Information
            </h2>

            {application.job ? (
              <>
                <div style={styles.jobTitle}>
                  {application.job.title ||
                    "N/A"}
                </div>

                <div style={styles.company}>
                  {application.job.company ||
                    "N/A"}
                </div>

                <div style={styles.infoList}>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>
                      Location
                    </span>

                    <span style={styles.infoValue}>
                      {application.job.location ||
                        "N/A"}
                    </span>
                  </div>

                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>
                      Job Type
                    </span>

                    <span style={styles.infoValue}>
                      {application.job.jobType ||
                        "N/A"}
                    </span>
                  </div>

                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>
                      Employer
                    </span>

                    <span style={styles.infoValue}>
                      {application.job.employer
                        ?.name || "N/A"}
                    </span>
                  </div>

                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>
                      Employer Email
                    </span>

                    <span style={styles.infoValue}>
                      {application.job.employer
                        ?.email || "N/A"}
                    </span>
                  </div>

                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>
                      Job ID
                    </span>

                    <span style={styles.idValue}>
                      {application.job._id ||
                        "N/A"}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div style={styles.warning}>
                This application is linked to a job
                that no longer exists.
              </div>
            )}
          </div>
        </div>

        {/* Application Information */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            Application Information
          </h2>

          <div style={styles.infoList}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>
                Application Status
              </span>

              <span
                style={getStatusStyle(
                  application.status
                )}
              >
                {application.status ||
                  "Unknown"}
              </span>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>
                Applied On
              </span>

              <span style={styles.infoValue}>
                {formatDateTime(
                  application.createdAt
                )}
              </span>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>
                Last Updated
              </span>

              <span style={styles.infoValue}>
                {formatDateTime(
                  application.updatedAt
                )}
              </span>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>
                Application ID
              </span>

              <span style={styles.idValue}>
                {application._id}
              </span>
            </div>
          </div>
        </div>

        {/* Resume */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            Resume
          </h2>

          {application.resume ? (
            <div style={styles.resumeBox}>
              <div>
                <div style={styles.resumeTitle}>
                  Resume submitted
                </div>

                <div style={styles.resumeSubtitle}>
                  The applicant attached a resume
                  with this application.
                </div>
              </div>

              <a
                href={application.resume}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.resumeButton}
              >
                View Resume
              </a>
            </div>
          ) : (
            <div style={styles.warning}>
              No resume was attached to this
              application.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "calc(100vh - 140px)",
    background: "#f8fafc",
    padding: "40px 20px 60px",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  backLink: {
    display: "inline-block",
    marginBottom: "25px",
    color: "#2563eb",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },

  label: {
    margin: 0,
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    color: "#2563eb",
  },

  title: {
    margin: "6px 0 8px",
    fontSize: "34px",
    fontWeight: "800",
    color: "#0f172a",
  },

  subtitle: {
    margin: 0,
    fontSize: "16px",
    color: "#64748b",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
    marginBottom: "20px",
  },

  card: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "20px",
    boxShadow:
      "0 4px 12px rgba(15, 23, 42, 0.05)",
  },

  cardTitle: {
    margin: "0 0 20px",
    fontSize: "19px",
    fontWeight: "700",
    color: "#0f172a",
  },

  profileBox: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "25px",
  },

  avatar: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    background: "#dbeafe",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    fontWeight: "700",
  },

  name: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "4px",
  },

  email: {
    fontSize: "13px",
    color: "#64748b",
  },

  jobTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "5px",
  },

  company: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "22px",
  },

  infoList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  infoItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    paddingBottom: "12px",
    borderBottom: "1px solid #f1f5f9",
  },

  infoLabel: {
    color: "#64748b",
    fontSize: "14px",
  },

  infoValue: {
    color: "#0f172a",
    fontSize: "14px",
    fontWeight: "600",
    textAlign: "right",
  },

  idValue: {
    color: "#64748b",
    fontSize: "12px",
    textAlign: "right",
    maxWidth: "250px",
    wordBreak: "break-all",
  },

  statusApplied: {
    display: "inline-block",
    padding: "6px 11px",
    borderRadius: "999px",
    background: "#dbeafe",
    color: "#1d4ed8",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  statusShortlisted: {
    display: "inline-block",
    padding: "6px 11px",
    borderRadius: "999px",
    background: "#fef3c7",
    color: "#b45309",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  statusRejected: {
    display: "inline-block",
    padding: "6px 11px",
    borderRadius: "999px",
    background: "#fee2e2",
    color: "#b91c1c",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  statusHired: {
    display: "inline-block",
    padding: "6px 11px",
    borderRadius: "999px",
    background: "#dcfce7",
    color: "#15803d",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  statusDefault: {
    display: "inline-block",
    padding: "6px 11px",
    borderRadius: "999px",
    background: "#f1f5f9",
    color: "#475569",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  resumeBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    padding: "18px",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    flexWrap: "wrap",
  },

  resumeTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "4px",
  },

  resumeSubtitle: {
    fontSize: "13px",
    color: "#64748b",
  },

  resumeButton: {
    display: "inline-block",
    padding: "10px 16px",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  warning: {
    padding: "15px",
    borderRadius: "10px",
    background: "#fff7ed",
    color: "#c2410c",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  loading: {
    textAlign: "center",
    padding: "80px 0",
    color: "#64748b",
    fontSize: "15px",
  },

  error: {
    padding: "18px",
    borderRadius: "10px",
    background: "#fee2e2",
    color: "#b91c1c",
    textAlign: "center",
    marginBottom: "20px",
  },
};

export default AdminApplicationDetails;