import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getMyApplications,
  viewApplicationResume,
} from "../services/api";

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

  const handleViewResume = async (applicationId) => {
    try {
      const blob = await viewApplicationResume(
        token,
        applicationId
      );

      const resumeUrl = URL.createObjectURL(blob);

      window.open(resumeUrl, "_blank");

      setTimeout(() => {
        URL.revokeObjectURL(resumeUrl);
      }, 60000);
    } catch (error) {
      alert(error.message);
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

  // Status styling
  const getStatusStyle = (status) => {
    switch (status) {
      case "Applied":
        return {
          background: "#eef2ff",
          color: "#4f46e5",
        };

      case "Shortlisted":
        return {
          background: "#fff7ed",
          color: "#ea580c",
        };

      case "Rejected":
        return {
          background: "#fef2f2",
          color: "#dc2626",
        };

      case "Hired":
        return {
          background: "#f0fdf4",
          color: "#16a34a",
        };

      default:
        return {
          background: "#f1f5f9",
          color: "#64748b",
        };
    }
  };

  return (
    <main style={styles.page}>
      <div style={styles.backgroundShapeOne}></div>
      <div style={styles.backgroundShapeTwo}></div>

      <div style={styles.container}>
        {/* ================= HEADER ================= */}

        <section style={styles.header}>
          <div>
            <span style={styles.sectionLabel}>
              JOB SEEKER DASHBOARD
            </span>

            <h1 style={styles.heading}>
              Welcome back, {user?.name}
            </h1>

            <p style={styles.headerDescription}>
              Track your applications and manage your job search
              from one place.
            </p>
          </div>

          <Link to="/jobs" style={styles.primaryButton}>
            <span>Browse Jobs</span>
            <span>→</span>
          </Link>
        </section>

        {/* ================= STATISTICS ================= */}

        <section style={styles.statsGrid}>
          <StatCard
            icon="📄"
            label="Total Applications"
            value={totalApplications}
          />

          <StatCard
            icon="📤"
            label="Applied"
            value={appliedCount}
          />

          <StatCard
            icon="⭐"
            label="Shortlisted"
            value={shortlistedCount}
          />

          <StatCard
            icon="❌"
            label="Rejected"
            value={rejectedCount}
          />

          <StatCard
            icon="🎉"
            label="Hired"
            value={hiredCount}
          />
        </section>

        {/* ================= APPLICATIONS ================= */}

        <section style={styles.applicationsSection}>
          <div style={styles.sectionHeader}>
            <div>
              <span style={styles.sectionLabel}>
                APPLICATION ACTIVITY
              </span>

              <h2 style={styles.sectionTitle}>
                My Applications
              </h2>

              <p style={styles.sectionDescription}>
                Keep track of the jobs you have applied for.
              </p>
            </div>

            <div style={styles.applicationCount}>
              {totalApplications}{" "}
              {totalApplications === 1
                ? "Application"
                : "Applications"}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div style={styles.messageCard}>
              <div style={styles.loadingSpinner}></div>

              <h3 style={styles.messageTitle}>
                Loading your applications...
              </h3>

              <p style={styles.messageText}>
                Please wait while we retrieve your application
                history.
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div style={styles.messageCard}>
              <div style={styles.messageIcon}>⚠️</div>

              <h3 style={styles.messageTitle}>
                Unable to load applications
              </h3>

              <p style={styles.messageText}>
                {error}
              </p>

              <button
                type="button"
                onClick={fetchApplications}
                style={styles.primaryButton}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading &&
            !error &&
            applications.length === 0 && (
              <div style={styles.emptyCard}>
                <div style={styles.emptyIcon}>
                  📋
                </div>

                <h3 style={styles.emptyTitle}>
                  No applications yet
                </h3>

                <p style={styles.emptyDescription}>
                  You haven't applied for any jobs yet.
                  Start exploring opportunities and submit
                  your first application.
                </p>

                <Link
                  to="/jobs"
                  style={styles.primaryButton}
                >
                  Explore Jobs →
                </Link>
              </div>
            )}

          {/* Applications */}
          {!loading &&
            !error &&
            applications.length > 0 && (
              <div style={styles.applicationList}>
                {applications.map((application) => {
                  const job = application.job;
                  const statusStyle = getStatusStyle(
                    application.status
                  );

                  return (
                    <article
                      key={application._id}
                      style={styles.applicationCard}
                    >
                      {/* Card Header */}
                      <div style={styles.applicationHeader}>
                        <div style={styles.companySection}>
                          <div style={styles.companyIcon}>
                            {job?.company
                              ? job.company
                                  .charAt(0)
                                  .toUpperCase()
                              : "C"}
                          </div>

                          <div style={styles.companyDetails}>
                            <h3 style={styles.applicationTitle}>
                              {job
                                ? job.title
                                : "Job no longer available"}
                            </h3>

                            {job && (
                              <p style={styles.companyName}>
                                {job.company}
                              </p>
                            )}
                          </div>
                        </div>

                        <span
                          style={{
                            ...styles.statusBadge,
                            ...statusStyle,
                          }}
                        >
                          {application.status}
                        </span>
                      </div>

                      {/* Job Meta */}
                      {job && (
                        <div style={styles.metaRow}>
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

                      {/* Application Information */}
                      <div style={styles.applicationInfo}>
                        <div style={styles.infoItem}>
                          <span style={styles.infoLabel}>
                            Applied on
                          </span>

                          <strong style={styles.infoValue}>
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

                        <div style={styles.infoItem}>
                          <span style={styles.infoLabel}>
                            Current Status
                          </span>

                          <strong
                            style={{
                              ...styles.infoValue,
                              color: statusStyle.color,
                            }}
                          >
                            {application.status}
                          </strong>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={styles.applicationFooter}>
                        <div style={styles.applicationActions}>
                          {job && (
                            <Link
                              to={`/jobs/${job._id}`}
                              style={styles.viewJobButton}
                            >
                              View Job →
                            </Link>
                          )}

                          {application.resume && (
                            <button
                              type="button"
                              onClick={() =>
                                handleViewResume(application._id)
                              }
                              style={styles.resumeButton}
                            >
                              📄 View Resume
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
        </section>

        {/* ================= CTA ================= */}

        <section style={styles.cta}>
          <div>
            <span style={styles.sectionLabel}>
              KEEP GOING
            </span>

            <h2 style={styles.ctaTitle}>
              Looking for your next opportunity?
            </h2>

            <p style={styles.ctaDescription}>
              Explore more jobs and find a position that matches
              your skills and career goals.
            </p>
          </div>

          <Link
            to="/jobs"
            style={styles.ctaButton}
          >
            Find More Jobs →
          </Link>
        </section>
      </div>
    </main>
  );
}

/* ================= STAT CARD ================= */

function StatCard({ icon, label, value }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statIcon}>
        {icon}
      </div>

      <div>
        <span style={styles.statLabel}>
          {label}
        </span>

        <strong style={styles.statValue}>
          {value}
        </strong>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "calc(100vh - 70px)",
    background:
      "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f8fafc 100%)",
    position: "relative",
    overflow: "hidden",
    paddingBottom: "80px",
  },

  backgroundShapeOne: {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "rgba(99, 102, 241, 0.07)",
    top: "-260px",
    left: "-220px",
    pointerEvents: "none",
  },

  backgroundShapeTwo: {
    position: "absolute",
    width: "420px",
    height: "420px",
    borderRadius: "50%",
    background: "rgba(59, 130, 246, 0.05)",
    bottom: "-220px",
    right: "-200px",
    pointerEvents: "none",
  },

  container: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "45px 24px 0",
    position: "relative",
    zIndex: 1,
  },

  header: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "30px",
    marginBottom: "30px",
  },

  sectionLabel: {
    display: "inline-block",
    color: "#4f46e5",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.4px",
    marginBottom: "8px",
  },

  heading: {
    margin: "0 0 8px",
    color: "#111827",
    fontSize: "36px",
    lineHeight: "1.15",
    letterSpacing: "-1px",
    fontWeight: "800",
  },

  headerDescription: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    background: "linear-gradient(135deg, #4f46e5, #2563eb)",
    color: "#ffffff",
    textDecoration: "none",
    border: "none",
    padding: "13px 18px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 7px 18px rgba(79, 70, 229, 0.18)",
    whiteSpace: "nowrap",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(5, minmax(0, 1fr))",
    gap: "14px",
    marginBottom: "35px",
  },

  statCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "18px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    boxShadow:
      "0 8px 25px rgba(15, 23, 42, 0.04)",
  },

  statIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "11px",
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "17px",
    flexShrink: 0,
  },

  statLabel: {
    display: "block",
    color: "#94a3b8",
    fontSize: "10px",
    fontWeight: "600",
    marginBottom: "4px",
  },

  statValue: {
    display: "block",
    color: "#1e293b",
    fontSize: "22px",
    fontWeight: "800",
  },

  applicationsSection: {
    marginBottom: "35px",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "20px",
  },

  sectionTitle: {
    margin: "0 0 5px",
    color: "#1e293b",
    fontSize: "24px",
    fontWeight: "800",
    letterSpacing: "-0.5px",
  },

  sectionDescription: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },

  applicationCount: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    color: "#475569",
    borderRadius: "999px",
    padding: "8px 13px",
    fontSize: "11px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  applicationList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  applicationCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "22px",
    boxShadow:
      "0 8px 25px rgba(15, 23, 42, 0.04)",
  },

  applicationHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
  },

  companySection: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    minWidth: 0,
  },

  companyIcon: {
    width: "48px",
    height: "48px",
    flexShrink: 0,
    borderRadius: "13px",
    background: "#eef2ff",
    color: "#4f46e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    fontWeight: "800",
  },

  companyDetails: {
    minWidth: 0,
  },

  applicationTitle: {
    margin: "0 0 4px",
    color: "#1e293b",
    fontSize: "16px",
    fontWeight: "800",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  companyName: {
    margin: 0,
    color: "#4f46e5",
    fontSize: "12px",
    fontWeight: "700",
  },

  statusBadge: {
    padding: "7px 11px",
    borderRadius: "999px",
    fontSize: "10px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "18px",
    marginTop: "18px",
    padding: "12px 0",
    borderTop: "1px solid #f1f5f9",
    borderBottom: "1px solid #f1f5f9",
    color: "#64748b",
    fontSize: "11px",
  },

  applicationInfo: {
    display: "flex",
    gap: "45px",
    marginTop: "17px",
  },

  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  infoLabel: {
    color: "#94a3b8",
    fontSize: "10px",
    fontWeight: "600",
  },

  infoValue: {
    color: "#334155",
    fontSize: "12px",
    fontWeight: "700",
  },

  applicationFooter: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "18px",
    paddingTop: "15px",
    borderTop: "1px solid #f1f5f9",
  },

  applicationActions: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    flexWrap: "wrap",
  },

  viewJobButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "9px 13px",
    borderRadius: "8px",
    background: "#eef2ff",
    color: "#4f46e5",
    textDecoration: "none",
    fontSize: "11px",
    fontWeight: "700",
  },

  resumeButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "9px 13px",
    borderRadius: "8px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    color: "#475569",
    textDecoration: "none",
    fontSize: "11px",
    fontWeight: "700",
    cursor: "pointer",
  },

  messageCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "45px 25px",
    textAlign: "center",
    boxShadow:
      "0 8px 25px rgba(15, 23, 42, 0.04)",
  },

  loadingSpinner: {
    width: "28px",
    height: "28px",
    border: "3px solid #e0e7ff",
    borderTopColor: "#4f46e5",
    borderRadius: "50%",
    margin: "0 auto 16px",
  },

  messageIcon: {
    fontSize: "32px",
    marginBottom: "10px",
  },

  messageTitle: {
    margin: "0 0 8px",
    color: "#1e293b",
    fontSize: "18px",
    fontWeight: "800",
  },

  messageText: {
    margin: "0 0 20px",
    color: "#64748b",
    fontSize: "13px",
  },

  emptyCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "55px 25px",
    textAlign: "center",
    boxShadow:
      "0 8px 25px rgba(15, 23, 42, 0.04)",
  },

  emptyIcon: {
    width: "60px",
    height: "60px",
    borderRadius: "16px",
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 17px",
    fontSize: "25px",
  },

  emptyTitle: {
    margin: "0 0 8px",
    color: "#1e293b",
    fontSize: "20px",
    fontWeight: "800",
  },

  emptyDescription: {
    maxWidth: "500px",
    margin: "0 auto 22px",
    color: "#64748b",
    fontSize: "13px",
    lineHeight: "1.7",
  },

  cta: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "30px",
    background:
      "linear-gradient(135deg, #eef2ff, #f8fafc)",
    border: "1px solid #e0e7ff",
    borderRadius: "20px",
    padding: "30px 32px",
  },

  ctaTitle: {
    margin: "0 0 7px",
    color: "#1e293b",
    fontSize: "23px",
    fontWeight: "800",
    letterSpacing: "-0.4px",
  },

  ctaDescription: {
    margin: 0,
    color: "#64748b",
    fontSize: "12px",
    lineHeight: "1.6",
  },

  ctaButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#ffffff",
    color: "#4f46e5",
    border: "1px solid #c7d2fe",
    borderRadius: "10px",
    padding: "12px 17px",
    textDecoration: "none",
    fontSize: "12px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },
};

export default JobSeekerDashboard;