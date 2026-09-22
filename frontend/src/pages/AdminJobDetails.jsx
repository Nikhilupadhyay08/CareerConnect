import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const AdminJobDetails = () => {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication required");
        }

        // Admin jobs API returns all jobs,
        // so we find the requested job by ID.
        const response = await fetch(`${API_URL}/admin/jobs`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch job details"
          );
        }

        const foundJob = (data.jobs || []).find(
          (item) => item._id === id
        );

        if (!foundJob) {
          throw new Error("Job not found");
        }

        setJob(foundJob);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <p style={styles.loading}>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.error}>{error}</div>

          <Link to="/admin/jobs" style={styles.backLink}>
            ← Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Back Button */}
        <Link to="/admin/jobs" style={styles.backLink}>
          ← Back to Jobs
        </Link>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <p style={styles.label}>ADMIN PANEL</p>

            <h1 style={styles.title}>{job.title}</h1>

            <p style={styles.company}>
              {job.company}
            </p>
          </div>

          <span style={styles.typeBadge}>
            {job.jobType}
          </span>
        </div>

        {/* Job Information */}
        <div style={styles.grid}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              Job Information
            </h2>

            <div style={styles.infoList}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>
                  Location
                </span>
                <span style={styles.infoValue}>
                  {job.location || "N/A"}
                </span>
              </div>

              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>
                  Salary
                </span>
                <span style={styles.infoValue}>
                  {job.salary || "Not specified"}
                </span>
              </div>

              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>
                  Job Type
                </span>
                <span style={styles.infoValue}>
                  {job.jobType || "N/A"}
                </span>
              </div>

              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>
                  Posted
                </span>
                <span style={styles.infoValue}>
                  {formatDate(job.createdAt)}
                </span>
              </div>

              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>
                  Last Updated
                </span>
                <span style={styles.infoValue}>
                  {formatDate(job.updatedAt)}
                </span>
              </div>

              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>
                  Job ID
                </span>
                <span style={styles.idValue}>
                  {job._id}
                </span>
              </div>
            </div>
          </div>

          {/* Employer */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              Employer Information
            </h2>

            <div style={styles.employerCard}>
              <div style={styles.avatar}>
                {job.employer?.name
                  ?.charAt(0)
                  ?.toUpperCase() || "E"}
              </div>

              <div>
                <div style={styles.employerName}>
                  {job.employer?.name || "N/A"}
                </div>

                <div style={styles.employerEmail}>
                  {job.employer?.email || "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            Job Description
          </h2>

          <p style={styles.description}>
            {job.description || "No description provided."}
          </p>
        </div>

        {/* Requirements */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            Requirements
          </h2>

          {job.requirements?.length > 0 ? (
            <ul style={styles.requirements}>
              {job.requirements.map((requirement, index) => (
                <li
                  key={index}
                  style={styles.requirementItem}
                >
                  {requirement}
                </li>
              ))}
            </ul>
          ) : (
            <p style={styles.noRequirements}>
              No requirements specified.
            </p>
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
    margin: "6px 0 6px",
    fontSize: "34px",
    fontWeight: "800",
    color: "#0f172a",
  },

  company: {
    margin: 0,
    fontSize: "17px",
    color: "#64748b",
  },

  typeBadge: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "#dbeafe",
    color: "#1d4ed8",
    fontSize: "13px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
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

  infoList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
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
    maxWidth: "220px",
    wordBreak: "break-all",
  },

  employerCard: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  avatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "#dbeafe",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "700",
  },

  employerName: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "4px",
  },

  employerEmail: {
    fontSize: "13px",
    color: "#64748b",
  },

  description: {
    margin: 0,
    color: "#475569",
    fontSize: "15px",
    lineHeight: "1.7",
    whiteSpace: "pre-wrap",
  },

  requirements: {
    margin: 0,
    paddingLeft: "22px",
    color: "#475569",
  },

  requirementItem: {
    marginBottom: "10px",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  noRequirements: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },

  loading: {
    textAlign: "center",
    padding: "80px 0",
    color: "#64748b",
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

export default AdminJobDetails;