import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const AdminApplications = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all applications
  useEffect(() => {
    const fetchApplications = async () => {
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
            data.message || "Failed to fetch applications"
          );
        }

        setApplications(data.applications || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Format application date
  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Status badge styles
  const getStatusStyle = (status) => {
    switch (status) {
      case "Applied":
        return {
          background: "#dbeafe",
          color: "#1d4ed8",
        };

      case "Shortlisted":
        return {
          background: "#fef3c7",
          color: "#b45309",
        };

      case "Rejected":
        return {
          background: "#fee2e2",
          color: "#b91c1c",
        };

      case "Hired":
        return {
          background: "#dcfce7",
          color: "#15803d",
        };

      default:
        return {
          background: "#f1f5f9",
          color: "#475569",
        };
    }
  };

  // View resume using authenticated request
  const handleViewResume = async (applicationId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${API_URL}/applications/${applicationId}/resume/view`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));

        throw new Error(
          data.message || "Failed to open resume"
        );
      }

      const blob = await response.blob();

      const resumeUrl = URL.createObjectURL(blob);

      window.open(resumeUrl, "_blank");

      // Clean up the temporary object URL
      setTimeout(() => {
        URL.revokeObjectURL(resumeUrl);
      }, 60000);
    } catch (error) {
      alert(error.message);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <p style={styles.loading}>
            Loading applications...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.error}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <p style={styles.label}>
              ADMIN PANEL
            </p>

            <h1 style={styles.title}>
              Application Management
            </h1>

            <p style={styles.subtitle}>
              View all applications submitted on CareerConnect.
            </p>
          </div>

          <div style={styles.totalBox}>
            <span style={styles.totalLabel}>
              Total Applications
            </span>

            <strong style={styles.totalValue}>
              {applications.length}
            </strong>
          </div>
        </div>

        {/* Applications Table */}
        <div style={styles.tableCard}>
          {applications.length === 0 ? (
            <div style={styles.empty}>
              No applications found.
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>
                      Applicant
                    </th>

                    <th style={styles.th}>
                      Job
                    </th>

                    <th style={styles.th}>
                      Company
                    </th>

                    <th style={styles.th}>
                      Employer
                    </th>

                    <th style={styles.th}>
                      Status
                    </th>

                    <th style={styles.th}>
                      Applied
                    </th>

                    <th style={styles.th}>
                      Resume
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map((application) => (
                    <tr
                      key={application._id}
                      onClick={() =>
                        navigate(`/admin/applications/${application._id}`)
                      }
                      style={styles.tableRow}
                      onMouseEnter={(event) => {
                        event.currentTarget.style.background = "#f8fafc";
                      }}
                      onMouseLeave={(event) => {
                        event.currentTarget.style.background = "#ffffff";
                      }}
                    >

                      {/* Applicant */}
                      <td style={styles.td}>
                        <div style={styles.personName}>
                          {application.applicant?.name ||
                            "N/A"}
                        </div>

                        <div style={styles.email}>
                          {application.applicant?.email ||
                            ""}
                        </div>
                      </td>

                      {/* Job */}
                      <td style={styles.td}>
                        <div style={styles.jobTitle}>
                          {application.job?.title ||
                            "N/A"}
                        </div>

                        {!application.job && (
                          <div style={styles.deletedJob}>
                            Job no longer available
                          </div>
                        )}
                      </td>

                      {/* Company */}
                      <td style={styles.td}>
                        {application.job?.company ||
                          "N/A"}
                      </td>

                      {/* Employer */}
                      <td style={styles.td}>
                        <div style={styles.personName}>
                          {application.job?.employer?.name ||
                            "N/A"}
                        </div>

                        <div style={styles.email}>
                          {application.job?.employer?.email ||
                            ""}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={styles.td}>
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
                      </td>

                      {/* Applied Date */}
                      <td style={styles.td}>
                        {formatDate(
                          application.createdAt
                        )}
                      </td>

                      {/* Resume */}
                      <td style={styles.td}>
                        {application.resume ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleViewResume(
                                application._id
                              )
                            }
                            style={styles.resumeButton}
                          >
                            View Resume
                          </button>
                        ) : (
                          <span style={styles.noResume}>
                            No Resume
                          </span>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
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
    maxWidth: "1500px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
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

  totalBox: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "14px 22px",
    minWidth: "150px",
    textAlign: "center",
  },

  totalLabel: {
    display: "block",
    fontSize: "13px",
    color: "#64748b",
    marginBottom: "4px",
  },

  totalValue: {
    fontSize: "28px",
    color: "#0f172a",
  },

  tableCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow:
      "0 4px 12px rgba(15, 23, 42, 0.05)",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1250px",
  },

  th: {
    textAlign: "left",
    padding: "16px 18px",
    background: "#f8fafc",
    color: "#475569",
    fontSize: "13px",
    fontWeight: "700",
    borderBottom: "1px solid #e2e8f0",
    whiteSpace: "nowrap",
  },

  tableRow: {
    cursor: "pointer",
    background: "#ffffff",
    transition: "background 0.15s ease",
  },

  td: {
    padding: "17px 18px",
    color: "#334155",
    fontSize: "14px",
    borderBottom: "1px solid #f1f5f9",
    verticalAlign: "top",
  },

  personName: {
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: "3px",
  },

  email: {
    fontSize: "12px",
    color: "#64748b",
  },

  jobTitle: {
    fontWeight: "700",
    color: "#0f172a",
    minWidth: "160px",
  },

  deletedJob: {
    marginTop: "5px",
    fontSize: "11px",
    color: "#94a3b8",
    fontStyle: "italic",
  },

  statusBadge: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  resumeButton: {
    padding: "7px 12px",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  noResume: {
    color: "#94a3b8",
    whiteSpace: "nowrap",
  },

  empty: {
    padding: "50px 20px",
    textAlign: "center",
    color: "#64748b",
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
  },
};

export default AdminApplications;