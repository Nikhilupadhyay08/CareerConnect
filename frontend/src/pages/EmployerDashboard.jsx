import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyJobs, deleteJob } from "../services/api";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

function EmployerDashboard() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [applicantCounts, setApplicantCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyJobs(token);
      const employerJobs = data.jobs || [];

      setJobs(employerJobs);

      const counts = {};

      await Promise.all(
        employerJobs.map(async (job) => {
          try {
            const response = await fetch(
              `${API_URL}/applications/job/${job._id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!response.ok) {
              counts[job._id] = 0;
              return;
            }

            const applicationData = await response.json();

            counts[job._id] = applicationData.count || 0;
          } catch {
            counts[job._id] = 0;
          }
        })
      );

      setApplicantCounts(counts);
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

      setApplicantCounts((currentCounts) => {
        const updatedCounts = { ...currentCounts };

        delete updatedCounts[jobId];

        return updatedCounts;
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const totalJobs = jobs.length;

  const fullTimeJobs = jobs.filter(
    (job) => job.jobType === "Full-time"
  ).length;

  const internshipJobs = jobs.filter(
    (job) => job.jobType === "Internship"
  ).length;

  const totalApplicants = Object.values(applicantCounts).reduce(
    (total, count) => total + count,
    0
  );

  return (
    <main style={styles.page}>
      <div style={styles.backgroundShapeOne}></div>
      <div style={styles.backgroundShapeTwo}></div>

      <div
        style={{
          ...styles.container,
          padding: isMobile ? "30px 16px 0" : "45px 24px 0",
        }}
      >
        {/* ================= HEADER ================= */}

        <section
          style={{
            ...styles.header,
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "flex-end",
            gap: isMobile ? "20px" : "30px",
            marginBottom: isMobile ? "25px" : "30px",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <span style={styles.sectionLabel}>
              EMPLOYER DASHBOARD
            </span>

            <h1
              style={{
                ...styles.heading,
                fontSize: isMobile ? "28px" : "36px",
              }}
            >
              Welcome back, {user?.name}
            </h1>

            <p style={styles.headerDescription}>
              Manage your job postings and connect with talented
              candidates.
            </p>
          </div>

          <button
            type="button"
            style={{
              ...styles.primaryButton,
              width: isMobile ? "100%" : "auto",
            }}
            onClick={() =>
              navigate("/employer/create-job")
            }
          >
            <span>+</span>
            <span>Post a New Job</span>
          </button>
        </section>

        {/* ================= STATISTICS ================= */}

        <section
          style={{
            ...styles.statsGrid,
            gridTemplateColumns: isMobile
              ? "repeat(2, minmax(0, 1fr))"
              : "repeat(4, minmax(0, 1fr))",
            gap: isMobile ? "10px" : "14px",
            marginBottom: isMobile ? "28px" : "35px",
          }}
        >
          <StatCard
            icon="💼"
            label="Total Jobs"
            value={totalJobs}
            isMobile={isMobile}
          />

          <StatCard
            icon="🏢"
            label="Full-time Jobs"
            value={fullTimeJobs}
            isMobile={isMobile}
          />

          <StatCard
            icon="🎓"
            label="Internships"
            value={internshipJobs}
            isMobile={isMobile}
          />

          <StatCard
            icon="👥"
            label="Total Applicants"
            value={totalApplicants}
            isMobile={isMobile}
          />
        </section>

        {/* ================= JOBS ================= */}

        <section style={styles.jobsSection}>
          <div
            style={{
              ...styles.sectionHeader,
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "flex-end",
              gap: isMobile ? "12px" : "20px",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <span style={styles.sectionLabel}>
                JOB MANAGEMENT
              </span>

              <h2 style={styles.sectionTitle}>
                My Posted Jobs
              </h2>

              <p style={styles.sectionDescription}>
                Manage your current job openings and applicants.
              </p>
            </div>

            <div style={styles.jobCount}>
              {totalJobs}{" "}
              {totalJobs === 1 ? "Job" : "Jobs"}
            </div>
          </div>

          {/* Loading */}

          {loading && (
            <div style={styles.messageCard}>
              <div style={styles.loadingSpinner}></div>

              <h3 style={styles.messageTitle}>
                Loading your jobs...
              </h3>

              <p style={styles.messageText}>
                Please wait while we retrieve your job postings.
              </p>
            </div>
          )}

          {/* Error */}

          {!loading && error && (
            <div style={styles.messageCard}>
              <div style={styles.messageIcon}>⚠️</div>

              <h3 style={styles.messageTitle}>
                Unable to load jobs
              </h3>

              <p style={styles.messageText}>
                {error}
              </p>

              <button
                type="button"
                onClick={fetchMyJobs}
                style={styles.primaryButton}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty */}

          {!loading &&
            !error &&
            jobs.length === 0 && (
              <div style={styles.emptyCard}>
                <div style={styles.emptyIcon}>
                  💼
                </div>

                <h3 style={styles.emptyTitle}>
                  No jobs posted yet
                </h3>

                <p style={styles.emptyDescription}>
                  Create your first job posting and start finding
                  talented candidates.
                </p>

                <button
                  type="button"
                  style={styles.primaryButton}
                  onClick={() =>
                    navigate("/employer/create-job")
                  }
                >
                  + Create Your First Job
                </button>
              </div>
            )}

          {/* Job Cards */}

          {!loading &&
            !error &&
            jobs.length > 0 && (
              <div style={styles.jobList}>
                {jobs.map((job) => {
                  const applicantCount =
                    applicantCounts[job._id] || 0;

                  return (
                    <article
                      key={job._id}
                      style={{
                        ...styles.jobCard,
                        padding: isMobile ? "17px" : "22px",
                      }}
                    >
                      {/* Job Header */}

                      <div
                        style={{
                          ...styles.jobHeader,
                          flexDirection: isMobile
                            ? "column"
                            : "row",
                          alignItems: isMobile
                            ? "flex-start"
                            : "center",
                          gap: isMobile ? "12px" : "20px",
                        }}
                      >
                        <div style={styles.jobIdentity}>
                          <div style={styles.companyIcon}>
                            {job.company
                              ? job.company
                                  .charAt(0)
                                  .toUpperCase()
                              : "C"}
                          </div>

                          <div
                            style={styles.jobIdentityText}
                          >
                            <h3
                              style={{
                                ...styles.jobTitle,
                                whiteSpace: isMobile
                                  ? "normal"
                                  : "nowrap",
                                overflow: isMobile
                                  ? "visible"
                                  : "hidden",
                                textOverflow: isMobile
                                  ? "clip"
                                  : "ellipsis",
                                overflowWrap: "anywhere",
                              }}
                            >
                              {job.title}
                            </h3>

                            <p style={styles.companyName}>
                              {job.company}
                            </p>
                          </div>
                        </div>

                        <span
                          style={{
                            ...styles.jobTypeBadge,
                            alignSelf: isMobile
                              ? "flex-start"
                              : "auto",
                          }}
                        >
                          {job.jobType}
                        </span>
                      </div>

                      {/* Job Meta */}

                      <div style={styles.metaRow}>
                        <span>📍 {job.location}</span>

                        <span>💰 {job.salary}</span>

                        <span>
                          👥 {applicantCount}{" "}
                          {applicantCount === 1
                            ? "Applicant"
                            : "Applicants"}
                        </span>

                        <span>
                          📅 Posted{" "}
                          {new Date(
                            job.createdAt
                          ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      {/* Description */}

                      <p style={styles.jobDescription}>
                        {job.description}
                      </p>

                      {/* Requirements */}

                      {job.requirements &&
                        job.requirements.length > 0 && (
                          <div style={styles.skillsSection}>
                            {job.requirements
                              .slice(0, 5)
                              .map(
                                (requirement, index) => (
                                  <span
                                    key={index}
                                    style={styles.skillTag}
                                  >
                                    {requirement}
                                  </span>
                                )
                              )}
                          </div>
                        )}

                      {/* Actions */}

                      <div
                        style={{
                          ...styles.jobFooter,
                          flexDirection: isMobile
                            ? "column"
                            : "row",
                          alignItems: isMobile
                            ? "stretch"
                            : "center",
                        }}
                      >
                        <Link
                          to={`/jobs/${job._id}`}
                          style={{
                            ...styles.viewJobButton,
                            width: isMobile
                              ? "100%"
                              : "auto",
                            boxSizing: "border-box",
                          }}
                        >
                          View Job →
                        </Link>

                        <div
                          style={{
                            ...styles.actionGroup,
                            width: isMobile
                              ? "100%"
                              : "auto",
                            flexDirection: isMobile
                              ? "column"
                              : "row",
                          }}
                        >
                          <button
                            type="button"
                            style={{
                              ...styles.editButton,
                              width: isMobile
                                ? "100%"
                                : "auto",
                            }}
                            onClick={() =>
                              navigate(
                                `/employer/edit-job/${job._id}`
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            style={{
                              ...styles.applicantsButton,
                              width: isMobile
                                ? "100%"
                                : "auto",
                            }}
                            onClick={() =>
                              navigate(
                                `/employer/job/${job._id}/applicants`
                              )
                            }
                          >
                            Applicants ({applicantCount})
                          </button>

                          <button
                            type="button"
                            style={{
                              ...styles.deleteButton,
                              width: isMobile
                                ? "100%"
                                : "auto",
                            }}
                            onClick={() =>
                              handleDelete(job._id)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
        </section>

        {/* ================= CTA ================= */}

        <section
          style={{
            ...styles.cta,
            flexDirection: isMobile
              ? "column"
              : "row",
            alignItems: isMobile
              ? "stretch"
              : "center",
            gap: isMobile ? "20px" : "30px",
            padding: isMobile
              ? "24px 20px"
              : "30px 32px",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <span style={styles.sectionLabel}>
              BUILD YOUR TEAM
            </span>

            <h2
              style={{
                ...styles.ctaTitle,
                fontSize: isMobile ? "20px" : "23px",
              }}
            >
              Looking for talented candidates?
            </h2>

            <p style={styles.ctaDescription}>
              Post a new opportunity and connect with skilled
              job seekers on CareerConnect.
            </p>
          </div>

          <button
            type="button"
            style={{
              ...styles.ctaButton,
              width: isMobile ? "100%" : "auto",
            }}
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

/* ================= STAT CARD ================= */

function StatCard({ icon, label, value, isMobile }) {
  return (
    <div
      style={{
        ...styles.statCard,
        padding: isMobile ? "14px 12px" : "18px",
        gap: isMobile ? "9px" : "12px",
      }}
    >
      <div style={styles.statIcon}>
        {icon}
      </div>

      <div style={{ minWidth: 0 }}>
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
    position: "relative",
    zIndex: 1,
    boxSizing: "border-box",
    width: "100%",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
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
    lineHeight: "1.15",
    letterSpacing: "-1px",
    fontWeight: "800",
    overflowWrap: "anywhere",
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
    background:
      "linear-gradient(135deg, #4f46e5, #2563eb)",
    color: "#ffffff",
    textDecoration: "none",
    border: "none",
    padding: "13px 18px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow:
      "0 7px 18px rgba(79, 70, 229, 0.18)",
    whiteSpace: "nowrap",
    boxSizing: "border-box",
  },

  statsGrid: {
    display: "grid",
  },

  statCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    boxShadow:
      "0 8px 25px rgba(15, 23, 42, 0.04)",
    minWidth: 0,
    boxSizing: "border-box",
  },

  statIcon: {
    width: "42px",
    height: "42px",
    flexShrink: 0,
    borderRadius: "11px",
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "17px",
  },

  statLabel: {
    display: "block",
    color: "#94a3b8",
    fontSize: "10px",
    fontWeight: "600",
    marginBottom: "4px",
    whiteSpace: "nowrap",
  },

  statValue: {
    display: "block",
    color: "#1e293b",
    fontSize: "23px",
    fontWeight: "800",
  },

  jobsSection: {
    marginBottom: "35px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
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
    lineHeight: "1.5",
  },

  jobCount: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    color: "#475569",
    borderRadius: "999px",
    padding: "8px 13px",
    fontSize: "11px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  jobList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  jobCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    boxShadow:
      "0 8px 25px rgba(15, 23, 42, 0.04)",
    boxSizing: "border-box",
    minWidth: 0,
    overflow: "hidden",
  },

  jobHeader: {
    display: "flex",
    justifyContent: "space-between",
  },

  jobIdentity: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    minWidth: 0,
    width: "100%",
  },

  companyIcon: {
    width: "50px",
    height: "50px",
    flexShrink: 0,
    borderRadius: "14px",
    background: "#eef2ff",
    color: "#4f46e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    fontWeight: "800",
  },

  jobIdentityText: {
    minWidth: 0,
    flex: 1,
  },

  jobTitle: {
    margin: "0 0 4px",
    color: "#1e293b",
    fontSize: "17px",
    fontWeight: "800",
    lineHeight: "1.3",
  },

  companyName: {
    margin: 0,
    color: "#4f46e5",
    fontSize: "12px",
    fontWeight: "700",
    overflowWrap: "anywhere",
  },

  jobTypeBadge: {
    padding: "7px 11px",
    borderRadius: "999px",
    background: "#eef2ff",
    color: "#4f46e5",
    fontSize: "10px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px 18px",
    marginTop: "18px",
    padding: "12px 0",
    borderTop: "1px solid #f1f5f9",
    borderBottom: "1px solid #f1f5f9",
    color: "#64748b",
    fontSize: "11px",
    lineHeight: "1.5",
  },

  jobDescription: {
    margin: "17px 0 14px",
    color: "#64748b",
    fontSize: "12px",
    lineHeight: "1.7",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },

  skillsSection: {
    display: "flex",
    flexWrap: "wrap",
    gap: "7px",
  },

  skillTag: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    color: "#475569",
    padding: "5px 9px",
    borderRadius: "6px",
    fontSize: "10px",
    fontWeight: "600",
    maxWidth: "100%",
    overflowWrap: "anywhere",
    boxSizing: "border-box",
  },

  jobFooter: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    marginTop: "18px",
    paddingTop: "15px",
    borderTop: "1px solid #f1f5f9",
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
    boxSizing: "border-box",
  },

  actionGroup: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },

  editButton: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    color: "#475569",
    padding: "9px 13px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "700",
    cursor: "pointer",
    boxSizing: "border-box",
  },

  applicantsButton: {
    background: "#eef2ff",
    border: "1px solid #e0e7ff",
    color: "#4f46e5",
    padding: "9px 13px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "700",
    cursor: "pointer",
    boxSizing: "border-box",
  },

  deleteButton: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    padding: "9px 13px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "700",
    cursor: "pointer",
    boxSizing: "border-box",
  },

  messageCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "45px 25px",
    textAlign: "center",
    boxShadow:
      "0 8px 25px rgba(15, 23, 42, 0.04)",
    boxSizing: "border-box",
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
    lineHeight: "1.6",
    overflowWrap: "anywhere",
  },

  emptyCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "55px 25px",
    textAlign: "center",
    boxShadow:
      "0 8px 25px rgba(15, 23, 42, 0.04)",
    boxSizing: "border-box",
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
    justifyContent: "space-between",
    background:
      "linear-gradient(135deg, #eef2ff, #f8fafc)",
    border: "1px solid #e0e7ff",
    borderRadius: "20px",
    boxSizing: "border-box",
  },

  ctaTitle: {
    margin: "0 0 7px",
    color: "#1e293b",
    fontWeight: "800",
    letterSpacing: "-0.4px",
    lineHeight: "1.3",
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
    background:
      "linear-gradient(135deg, #4f46e5, #2563eb)",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "12px 17px",
    fontSize: "12px",
    fontWeight: "800",
    whiteSpace: "nowrap",
    cursor: "pointer",
    boxShadow:
      "0 7px 18px rgba(79, 70, 229, 0.18)",
    boxSizing: "border-box",
  },
};

export default EmployerDashboard;