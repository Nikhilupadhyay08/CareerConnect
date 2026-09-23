import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSavedJobs, removeSavedJob } from "../services/api";
import { useAuth } from "../context/AuthContext";

function SavedJobs() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
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

  useEffect(() => {
    if (!token || user?.role !== "jobseeker") {
      navigate("/login");
      return;
    }

    const fetchSavedJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getSavedJobs(token);

        setSavedJobs(data.savedJobs || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [token, user?.role, navigate]);

  const handleRemove = async (jobId) => {
    try {
      setRemovingId(jobId);
      setError("");

      await removeSavedJob(token, jobId);

      setSavedJobs((currentJobs) =>
        currentJobs.filter(
          (savedJob) => savedJob.job?._id !== jobId
        )
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <main style={styles.page}>
        <div
          style={{
            ...styles.messageContainer,
            ...(isMobile ? styles.messageContainerMobile : {}),
          }}
        >
          <div style={styles.spinner}></div>

          <h2 style={styles.messageTitle}>
            Loading saved jobs...
          </h2>

          <p style={styles.messageText}>
            Please wait while we load your saved jobs.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.backgroundShapeOne}></div>
      <div style={styles.backgroundShapeTwo}></div>

      <div
        style={{
          ...styles.container,
          ...(isMobile ? styles.containerMobile : {}),
        }}
      >
        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <span style={styles.eyebrow}>
              YOUR COLLECTION
            </span>

            <h1 style={styles.title}>
              Saved Jobs
            </h1>

            <p style={styles.subtitle}>
              Keep track of the opportunities you want to
              explore later.
            </p>
          </div>

          <Link to="/jobs" style={styles.browseButton}>
            Browse Jobs →
          </Link>
        </div>

        {/* ERROR */}
        {error && (
          <div style={styles.errorMessage}>
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* EMPTY STATE */}
        {!error && savedJobs.length === 0 && (
          <div style={styles.emptyCard}>
            <div style={styles.emptyIcon}>🔖</div>

            <h2 style={styles.emptyTitle}>
              No Saved Jobs
            </h2>

            <p style={styles.emptyText}>
              You haven't saved any jobs yet. Browse available
              jobs and save the ones you're interested in.
            </p>

            <Link
              to="/jobs"
              style={styles.primaryButton}
            >
              Browse Jobs
              <span>→</span>
            </Link>
          </div>
        )}

        {/* SAVED JOBS */}
        {savedJobs.length > 0 && (
          <div style={styles.content}>
            <div style={styles.countRow}>
              <span style={styles.countText}>
                {savedJobs.length}{" "}
                {savedJobs.length === 1 ? "job" : "jobs"} saved
              </span>
            </div>

            <div
              style={{
                ...styles.jobsGrid,
                ...(isMobile ? styles.jobsGridMobile : {}),
              }}
            >
              {savedJobs.map((savedJob) => {
                const job = savedJob.job;

                if (!job) {
                  return null;
                }

                return (
                  <article
                    key={savedJob._id}
                    style={styles.jobCard}
                  >
                    <div style={styles.jobTop}>
                      <div style={styles.companyIcon}>
                        {job.company
                          ? job.company
                              .charAt(0)
                              .toUpperCase()
                          : "C"}
                      </div>

                      <span style={styles.jobTypeBadge}>
                        {job.jobType}
                      </span>
                    </div>

                    <div style={styles.jobInfo}>
                      <h2 style={styles.jobTitle}>
                        {job.title}
                      </h2>

                      <p style={styles.companyName}>
                        {job.company}
                      </p>

                      <div style={styles.jobMeta}>
                        <span>
                          📍 {job.location}
                        </span>

                        <span>
                          💰 {job.salary}
                        </span>
                      </div>
                    </div>

                    {job.requirements &&
                      job.requirements.length > 0 && (
                        <div style={styles.requirements}>
                          {job.requirements
                            .slice(0, 3)
                            .map((requirement, index) => (
                              <span
                                key={index}
                                style={styles.requirementTag}
                              >
                                {requirement}
                              </span>
                            ))}
                        </div>
                      )}

                    <div style={styles.cardActions}>
                      <Link
                        to={`/jobs/${job._id}`}
                        style={styles.viewButton}
                      >
                        View Job
                        <span>→</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemove(job._id)
                        }
                        disabled={
                          removingId === job._id
                        }
                        style={{
                          ...styles.removeButton,
                          ...(removingId === job._id
                            ? styles.disabledButton
                            : {}),
                        }}
                      >
                        {removingId === job._id
                          ? "Removing..."
                          : "Remove"}
                      </button>
                    </div>
                  </article>
                );
              })}
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
    paddingBottom: "80px",
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
    top: "550px",
    right: "-250px",
    pointerEvents: "none",
  },

  container: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "50px 24px 0",
    position: "relative",
    zIndex: 1,
  },

  containerMobile: {
    padding: "30px 16px 0",
  },

  header: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "30px",
  },

  eyebrow: {
    display: "block",
    marginBottom: "6px",
    color: "#6366f1",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1.2px",
  },

  title: {
    margin: "0 0 8px",
    color: "#111827",
    fontSize: "36px",
    lineHeight: "1.15",
    fontWeight: "800",
    letterSpacing: "-0.8px",
  },

  subtitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  browseButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 18px",
    borderRadius: "10px",
    background:
      "linear-gradient(135deg, #4f46e5, #2563eb)",
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
    boxShadow:
      "0 7px 18px rgba(79, 70, 229, 0.18)",
  },

  content: {
    width: "100%",
  },

  countRow: {
    marginBottom: "15px",
  },

  countText: {
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "700",
  },

  jobsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "20px",
  },

  jobsGridMobile: {
    gridTemplateColumns: "1fr",
    gap: "16px",
  },

  jobCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "22px",
    boxShadow:
      "0 10px 30px rgba(15, 23, 42, 0.05)",
    minWidth: 0,
  },

  jobTop: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "18px",
  },

  companyIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    background:
      "linear-gradient(135deg, #eef2ff, #e0e7ff)",
    color: "#4f46e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
    fontWeight: "800",
    flexShrink: 0,
  },

  jobTypeBadge: {
    display: "inline-flex",
    padding: "6px 9px",
    borderRadius: "999px",
    background: "#eef2ff",
    color: "#4f46e5",
    fontSize: "9px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
  },

  jobInfo: {
    minWidth: 0,
  },

  jobTitle: {
    margin: "0 0 6px",
    color: "#1e293b",
    fontSize: "19px",
    lineHeight: "1.3",
    fontWeight: "800",
    overflowWrap: "anywhere",
  },

  companyName: {
    margin: "0 0 14px",
    color: "#4f46e5",
    fontSize: "13px",
    fontWeight: "700",
    overflowWrap: "anywhere",
  },

  jobMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px 16px",
    color: "#64748b",
    fontSize: "11px",
  },

  requirements: {
    display: "flex",
    flexWrap: "wrap",
    gap: "7px",
    marginTop: "18px",
  },

  requirementTag: {
    padding: "6px 9px",
    borderRadius: "7px",
    background: "#f8fafc",
    border: "1px solid #eef2f7",
    color: "#64748b",
    fontSize: "10px",
    fontWeight: "600",
  },

  cardActions: {
    display: "flex",
    gap: "9px",
    marginTop: "22px",
    paddingTop: "18px",
    borderTop: "1px solid #f1f5f9",
  },

  viewButton: {
    flex: 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "11px 14px",
    borderRadius: "9px",
    background:
      "linear-gradient(135deg, #4f46e5, #2563eb)",
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "11px",
    fontWeight: "700",
  },

  removeButton: {
    padding: "11px 14px",
    borderRadius: "9px",
    border: "1px solid #fecaca",
    background: "#fef2f2",
    color: "#dc2626",
    fontSize: "11px",
    fontWeight: "700",
    cursor: "pointer",
  },

  disabledButton: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  emptyCard: {
    maxWidth: "650px",
    margin: "40px auto",
    padding: "55px 30px",
    textAlign: "center",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    boxShadow:
      "0 15px 45px rgba(15, 23, 42, 0.06)",
  },

  emptyIcon: {
    width: "65px",
    height: "65px",
    margin: "0 auto 18px",
    borderRadius: "18px",
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "27px",
  },

  emptyTitle: {
    margin: "0 0 9px",
    color: "#1e293b",
    fontSize: "22px",
    fontWeight: "800",
  },

  emptyText: {
    maxWidth: "450px",
    margin: "0 auto 24px",
    color: "#64748b",
    fontSize: "13px",
    lineHeight: "1.7",
  },

  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "12px 18px",
    borderRadius: "10px",
    background:
      "linear-gradient(135deg, #4f46e5, #2563eb)",
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "12px",
    fontWeight: "700",
    boxShadow:
      "0 7px 18px rgba(79, 70, 229, 0.18)",
  },

  errorMessage: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "18px",
    padding: "12px",
    borderRadius: "10px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    fontSize: "12px",
  },

  messageContainer: {
    maxWidth: "600px",
    margin: "100px auto",
    padding: "50px 30px",
    textAlign: "center",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    boxShadow:
      "0 15px 45px rgba(15, 23, 42, 0.07)",
  },

  messageContainerMobile: {
    margin: "60px 16px",
    padding: "35px 20px",
  },

  spinner: {
    width: "30px",
    height: "30px",
    border: "3px solid #e0e7ff",
    borderTopColor: "#4f46e5",
    borderRadius: "50%",
    margin: "0 auto 18px",
  },

  messageTitle: {
    margin: "0 0 10px",
    color: "#1e293b",
    fontSize: "22px",
  },

  messageText: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.7",
  },
};

export default SavedJobs;