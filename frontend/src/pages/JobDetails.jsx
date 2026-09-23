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

  const handleResumeChange = (event) => {
    const selectedFile = event.target.files[0];

    setResume(selectedFile || null);
    setError("");
    setSuccess("");
  };

  const handleRemoveResume = () => {
    setResume(null);
    setError("");
    setSuccess("");

    const fileInput = document.getElementById("resume");

    if (fileInput) {
      fileInput.value = "";
    }
  };

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
            Loading job details...
          </h2>

          <p style={styles.messageText}>
            Please wait while we load the opportunity.
          </p>
        </div>
      </main>
    );
  }

  if (error && !job) {
    return (
      <main style={styles.page}>
        <div
          style={{
            ...styles.messageContainer,
            ...(isMobile ? styles.messageContainerMobile : {}),
          }}
        >
          <div style={styles.messageIcon}>⚠️</div>

          <h2 style={styles.messageTitle}>
            Unable to load job
          </h2>

          <p style={styles.messageText}>{error}</p>

          <Link to="/jobs" style={styles.primaryButton}>
            ← Back to Jobs
          </Link>
        </div>
      </main>
    );
  }

  if (!job) {
    return (
      <main style={styles.page}>
        <div
          style={{
            ...styles.messageContainer,
            ...(isMobile ? styles.messageContainerMobile : {}),
          }}
        >
          <div style={styles.messageIcon}>🔎</div>

          <h2 style={styles.messageTitle}>
            Job not found
          </h2>

          <p style={styles.messageText}>
            The job you are looking for may have been removed or is
            no longer available.
          </p>

          <Link to="/jobs" style={styles.primaryButton}>
            ← Back to Jobs
          </Link>
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
        {/* BACK */}
        <Link to="/jobs" style={styles.backLink}>
          ← Back to Jobs
        </Link>

        {/* JOB HEADER */}
        <section
          style={{
            ...styles.jobHeader,
            ...(isMobile ? styles.jobHeaderMobile : {}),
          }}
        >
          <div
            style={{
              ...styles.headerMain,
              ...(isMobile ? styles.headerMainMobile : {}),
            }}
          >
            <div
              style={{
                ...styles.companyIcon,
                ...(isMobile ? styles.companyIconMobile : {}),
              }}
            >
              {job.company
                ? job.company.charAt(0).toUpperCase()
                : "C"}
            </div>

            <div style={styles.headerInfo}>
              <div style={styles.headerTop}>
                <span style={styles.jobTypeBadge}>
                  {job.jobType}
                </span>
              </div>

              <h1
                style={{
                  ...styles.jobTitle,
                  ...(isMobile ? styles.jobTitleMobile : {}),
                }}
              >
                {job.title}
              </h1>

              <p style={styles.companyName}>
                {job.company}
              </p>

              <div style={styles.headerMeta}>
                <span>
                  <span style={styles.metaIcon}>📍</span>
                  {job.location}
                </span>

                <span>
                  <span style={styles.metaIcon}>💰</span>
                  {job.salary}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section
          style={{
            ...styles.content,
            ...(isMobile ? styles.contentMobile : {}),
          }}
        >
          <div style={styles.mainColumn}>
            {/* DESCRIPTION */}
            <div
              style={{
                ...styles.detailsCard,
                ...(isMobile ? styles.detailsCardMobile : {}),
              }}
            >
              <div style={styles.cardHeading}>
                <div style={styles.cardIcon}>📋</div>

                <div>
                  <span style={styles.sectionEyebrow}>
                    ROLE OVERVIEW
                  </span>

                  <h2 style={styles.cardTitle}>
                    Job Description
                  </h2>
                </div>
              </div>

              <p style={styles.description}>
                {job.description}
              </p>
            </div>

            {/* REQUIREMENTS */}
            <div
              style={{
                ...styles.detailsCard,
                ...(isMobile ? styles.detailsCardMobile : {}),
              }}
            >
              <div style={styles.cardHeading}>
                <div style={styles.cardIcon}>✓</div>

                <div>
                  <span style={styles.sectionEyebrow}>
                    WHAT WE&apos;RE LOOKING FOR
                  </span>

                  <h2 style={styles.cardTitle}>
                    Requirements
                  </h2>
                </div>
              </div>

              {job.requirements &&
              job.requirements.length > 0 ? (
                <div
                  style={{
                    ...styles.requirementsGrid,
                    ...(isMobile
                      ? styles.requirementsGridMobile
                      : {}),
                  }}
                >
                  {job.requirements.map(
                    (requirement, index) => (
                      <div
                        key={index}
                        style={styles.requirement}
                      >
                        <span style={styles.requirementCheck}>
                          ✓
                        </span>

                        <span>{requirement}</span>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p style={styles.mutedText}>
                  No specific requirements listed.
                </p>
              )}
            </div>

            {/* EMPLOYER */}
            {job.employer && (
              <div
                style={{
                  ...styles.detailsCard,
                  ...(isMobile
                    ? styles.detailsCardMobile
                    : {}),
                }}
              >
                <div style={styles.cardHeading}>
                  <div style={styles.cardIcon}>🏢</div>

                  <div>
                    <span style={styles.sectionEyebrow}>
                      COMPANY
                    </span>

                    <h2 style={styles.cardTitle}>
                      About the Employer
                    </h2>
                  </div>
                </div>

                <div style={styles.employerInfo}>
                  <div style={styles.employerAvatar}>
                    {job.employer.name
                      ? job.employer.name
                          .charAt(0)
                          .toUpperCase()
                      : "E"}
                  </div>

                  <div style={styles.employerDetails}>
                    <h3 style={styles.employerName}>
                      {job.employer.name}
                    </h3>

                    <p style={styles.employerEmail}>
                      {job.employer.email}
                    </p>

                    <span style={styles.verifiedBadge}>
                      ✓ Verified Employer
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <aside
            style={{
              ...styles.sidebar,
              ...(isMobile ? styles.sidebarMobile : {}),
            }}
          >
            {/* SUMMARY */}
            <div
              style={{
                ...styles.detailsCard,
                ...(isMobile ? styles.detailsCardMobile : {}),
              }}
            >
              <div style={styles.cardHeading}>
                <div style={styles.cardIcon}>ℹ️</div>

                <div>
                  <span style={styles.sectionEyebrow}>
                    QUICK INFO
                  </span>

                  <h2 style={styles.cardTitle}>
                    Job Summary
                  </h2>
                </div>
              </div>

              <div style={styles.summaryList}>
                <SummaryItem
                  icon="💼"
                  label="Job Type"
                  value={job.jobType}
                />

                <SummaryItem
                  icon="📍"
                  label="Location"
                  value={job.location}
                />

                <SummaryItem
                  icon="💰"
                  label="Salary"
                  value={job.salary}
                />
              </div>
            </div>

            {/* JOBSEEKER APPLY */}
            {user?.role === "jobseeker" && (
              <div style={styles.applyCard}>
                <div style={styles.applyHeader}>
                  <div style={styles.applyIcon}>📄</div>

                  <span style={styles.applyBadge}>
                    APPLICATION
                  </span>
                </div>

                <h2 style={styles.applyTitle}>
                  Apply for this Job
                </h2>

                <p style={styles.applyDescription}>
                  Upload your latest resume and submit your
                  application.
                </p>

                <form onSubmit={handleApply}>
                  <label
                    htmlFor="resume"
                    style={styles.resumeLabel}
                  >
                    Resume
                  </label>

                  <div
                    style={{
                      ...styles.resumeUpload,
                      ...(resume
                        ? styles.resumeUploadSelected
                        : {}),
                    }}
                  >
                    <input
                      id="resume"
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleResumeChange}
                      style={styles.fileInput}
                    />

                    <div style={styles.uploadContent}>
                      <div style={styles.uploadIconBox}>
                        {resume ? "✓" : "📎"}
                      </div>

                      <div style={styles.uploadText}>
                        <strong style={styles.fileName}>
                          {resume
                            ? resume.name
                            : "Choose PDF resume"}
                        </strong>

                        <span style={styles.uploadSubtext}>
                          {resume
                            ? `${(
                                resume.size /
                                1024 /
                                1024
                              ).toFixed(2)} MB`
                            : "Click to browse your files"}
                        </span>
                      </div>

                      {resume && (
                        <button
                          type="button"
                          onClick={handleRemoveResume}
                          style={styles.removeResumeButton}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  <p style={styles.resumeHelp}>
                    PDF only • Maximum 5 MB
                  </p>

                  <button
                    type="submit"
                    disabled={applying}
                    style={{
                      ...styles.primaryButton,
                      ...styles.applyButton,
                      ...(applying
                        ? styles.disabledButton
                        : {}),
                    }}
                  >
                    {applying ? (
                      <>
                        <span
                          style={styles.smallSpinner}
                        ></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Apply for Job
                        <span style={styles.buttonArrow}>
                          →
                        </span>
                      </>
                    )}
                  </button>
                </form>

                {success && (
                  <div style={styles.successMessage}>
                    <span style={styles.messageCircle}>
                      ✓
                    </span>

                    <span>{success}</span>
                  </div>
                )}

                {error && (
                  <div style={styles.errorMessage}>
                    <span style={styles.messageCircle}>
                      ⚠
                    </span>

                    <span>{error}</span>
                  </div>
                )}
              </div>
            )}

            {/* LOGGED OUT */}
            {!user && (
              <div style={styles.applyCard}>
                <div style={styles.applyHeader}>
                  <div style={styles.applyIcon}>🔐</div>

                  <span style={styles.applyBadge}>
                    GET STARTED
                  </span>
                </div>

                <h2 style={styles.applyTitle}>
                  Interested in this Job?
                </h2>

                <p style={styles.applyDescription}>
                  Login or create an account to apply for this
                  position.
                </p>

                <Link
                  to="/login"
                  style={{
                    ...styles.primaryButton,
                    ...styles.fullButton,
                  }}
                >
                  Login to Apply
                  <span>→</span>
                </Link>

                <Link
                  to="/register"
                  style={{
                    ...styles.secondaryButton,
                    ...styles.fullButton,
                  }}
                >
                  Create Account
                </Link>
              </div>
            )}

            {/* EMPLOYER */}
            {user?.role === "employer" && (
              <div style={styles.noticeCard}>
                <div style={styles.applyIcon}>💼</div>

                <h2 style={styles.applyTitle}>
                  Employer Account
                </h2>

                <p style={styles.applyDescription}>
                  You are viewing this job as an employer.
                  Job applications are available to job seekers.
                </p>
              </div>
            )}

            {/* ADMIN */}
            {user?.role === "admin" && (
              <div style={styles.noticeCard}>
                <div style={styles.applyIcon}>🛡️</div>

                <h2 style={styles.applyTitle}>
                  Administrator Account
                </h2>

                <p style={styles.applyDescription}>
                  You are viewing this job as an administrator.
                </p>
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
}

function SummaryItem({ icon, label, value }) {
  return (
    <div style={styles.summaryItem}>
      <div style={styles.summaryLeft}>
        <span style={styles.summaryIcon}>{icon}</span>

        <span style={styles.summaryLabel}>
          {label}
        </span>
      </div>

      <strong style={styles.summaryValue}>
        {value}
      </strong>
    </div>
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
    top: "-290px",
    left: "-250px",
    pointerEvents: "none",
  },

  backgroundShapeTwo: {
    position: "absolute",
    width: "430px",
    height: "430px",
    borderRadius: "50%",
    background: "rgba(59, 130, 246, 0.05)",
    top: "600px",
    right: "-250px",
    pointerEvents: "none",
  },

  container: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "38px 24px 0",
    position: "relative",
    zIndex: 1,
  },

  containerMobile: {
    padding: "28px 16px 0",
  },

  backLink: {
    display: "inline-flex",
    alignItems: "center",
    color: "#64748b",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "20px",
  },

  jobHeader: {
    background:
      "linear-gradient(135deg, #ffffff 0%, #f8faff 100%)",
    border: "1px solid #e2e8f0",
    borderRadius: "24px",
    padding: "34px",
    boxShadow: "0 15px 45px rgba(15, 23, 42, 0.07)",
    marginBottom: "25px",
  },

  jobHeaderMobile: {
    padding: "22px",
    borderRadius: "20px",
    marginBottom: "18px",
  },

  headerMain: {
    display: "flex",
    alignItems: "center",
    gap: "22px",
  },

  headerMainMobile: {
    alignItems: "flex-start",
    gap: "15px",
  },

  companyIcon: {
    width: "78px",
    height: "78px",
    flexShrink: 0,
    borderRadius: "20px",
    background:
      "linear-gradient(135deg, #eef2ff, #e0e7ff)",
    color: "#4f46e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    fontWeight: "800",
    boxShadow: "0 8px 20px rgba(79, 70, 229, 0.10)",
  },

  companyIconMobile: {
    width: "58px",
    height: "58px",
    borderRadius: "16px",
    fontSize: "23px",
  },

  headerInfo: {
    minWidth: 0,
    flex: 1,
  },

  headerTop: {
    marginBottom: "8px",
  },

  jobTypeBadge: {
    display: "inline-flex",
    padding: "6px 11px",
    borderRadius: "999px",
    background: "#eef2ff",
    color: "#4f46e5",
    fontSize: "10px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
  },

  jobTitle: {
    margin: "0 0 7px",
    color: "#111827",
    fontSize: "36px",
    lineHeight: "1.15",
    letterSpacing: "-1px",
    fontWeight: "800",
  },

  jobTitleMobile: {
    fontSize: "27px",
    lineHeight: "1.15",
    letterSpacing: "-0.6px",
  },

  companyName: {
    margin: "0 0 13px",
    color: "#4f46e5",
    fontSize: "15px",
    fontWeight: "700",
  },

  headerMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "14px 20px",
    color: "#64748b",
    fontSize: "12px",
  },

  metaIcon: {
    marginRight: "5px",
  },

  content: {
    display: "grid",
    gridTemplateColumns: "1fr 350px",
    gap: "25px",
    alignItems: "start",
  },

  contentMobile: {
    gridTemplateColumns: "1fr",
    gap: "18px",
  },

  mainColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    minWidth: 0,
  },

  sidebar: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    position: "sticky",
    top: "90px",
    minWidth: 0,
  },

  sidebarMobile: {
    position: "static",
    width: "100%",
  },

  detailsCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "26px",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
    minWidth: 0,
  },

  detailsCardMobile: {
    padding: "20px",
    borderRadius: "16px",
  },

  cardHeading: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    marginBottom: "20px",
  },

  cardIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "11px",
    background: "#eef2ff",
    color: "#4f46e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    flexShrink: 0,
  },

  sectionEyebrow: {
    display: "block",
    marginBottom: "3px",
    color: "#6366f1",
    fontSize: "8px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  cardTitle: {
    margin: 0,
    color: "#1e293b",
    fontSize: "18px",
    fontWeight: "800",
  },

  description: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.85",
    whiteSpace: "pre-line",
    overflowWrap: "anywhere",
  },

  requirementsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
  },

  requirementsGridMobile: {
    gridTemplateColumns: "1fr",
  },

  requirement: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    padding: "12px",
    borderRadius: "11px",
    background: "#f8fafc",
    border: "1px solid #eef2f7",
    color: "#475569",
    fontSize: "13px",
    lineHeight: "1.5",
    minWidth: 0,
    overflowWrap: "anywhere",
  },

  requirementCheck: {
    width: "21px",
    height: "21px",
    flexShrink: 0,
    borderRadius: "50%",
    background: "#dcfce7",
    color: "#16a34a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: "800",
  },

  mutedText: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "13px",
  },

  employerInfo: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    minWidth: 0,
  },

  employerAvatar: {
    width: "55px",
    height: "55px",
    borderRadius: "15px",
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

  employerDetails: {
    minWidth: 0,
  },

  employerName: {
    margin: "0 0 4px",
    color: "#1e293b",
    fontSize: "15px",
    fontWeight: "800",
    overflowWrap: "anywhere",
  },

  employerEmail: {
    margin: 0,
    color: "#64748b",
    fontSize: "12px",
    overflowWrap: "anywhere",
  },

  verifiedBadge: {
    display: "inline-block",
    marginTop: "7px",
    padding: "5px 8px",
    borderRadius: "999px",
    background: "#f0fdf4",
    color: "#16a34a",
    fontSize: "9px",
    fontWeight: "800",
  },

  summaryList: {
    display: "flex",
    flexDirection: "column",
  },

  summaryItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    padding: "14px 0",
    borderBottom: "1px solid #f1f5f9",
  },

  summaryLeft: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    minWidth: 0,
  },

  summaryIcon: {
    fontSize: "14px",
    flexShrink: 0,
  },

  summaryLabel: {
    color: "#94a3b8",
    fontSize: "11px",
    fontWeight: "600",
  },

  summaryValue: {
    color: "#334155",
    fontSize: "12px",
    textAlign: "right",
    overflowWrap: "anywhere",
  },

  applyCard: {
    background:
      "linear-gradient(145deg, #ffffff 0%, #f8faff 100%)",
    border: "1px solid #dfe5ff",
    borderRadius: "18px",
    padding: "26px",
    boxShadow: "0 12px 35px rgba(79, 70, 229, 0.09)",
    minWidth: 0,
  },

  applyHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    marginBottom: "15px",
  },

  applyIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    flexShrink: 0,
  },

  applyBadge: {
    padding: "5px 8px",
    borderRadius: "999px",
    background: "#eef2ff",
    color: "#4f46e5",
    fontSize: "8px",
    fontWeight: "800",
    letterSpacing: "0.5px",
  },

  applyTitle: {
    margin: "0 0 8px",
    color: "#1e293b",
    fontSize: "18px",
    fontWeight: "800",
  },

  applyDescription: {
    margin: "0 0 20px",
    color: "#64748b",
    fontSize: "12px",
    lineHeight: "1.65",
  },

  resumeLabel: {
    display: "block",
    marginBottom: "7px",
    color: "#334155",
    fontSize: "12px",
    fontWeight: "700",
  },

  resumeUpload: {
    border: "1px dashed #cbd5e1",
    borderRadius: "12px",
    background: "#f8fafc",
    padding: "14px",
    position: "relative",
    overflow: "hidden",
  },

  resumeUploadSelected: {
    borderColor: "#818cf8",
    background: "#eef2ff",
  },

  fileInput: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    opacity: 0,
    cursor: "pointer",
  },

  uploadContent: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minWidth: 0,
  },

  uploadIconBox: {
    width: "34px",
    height: "34px",
    borderRadius: "9px",
    background: "#ffffff",
    color: "#4f46e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "800",
    flexShrink: 0,
  },

  uploadText: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    gap: "2px",
    flex: 1,
  },

  fileName: {
    color: "#475569",
    fontSize: "11px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  uploadSubtext: {
    color: "#94a3b8",
    fontSize: "9px",
  },

  resumeHelp: {
    margin: "7px 0 16px",
    color: "#94a3b8",
    fontSize: "10px",
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
    boxShadow: "0 7px 18px rgba(79, 70, 229, 0.18)",
  },

  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#ffffff",
    color: "#475569",
    textDecoration: "none",
    border: "1px solid #dbe2ea",
    padding: "12px 18px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },

  applyButton: {
    width: "100%",
  },

  fullButton: {
    width: "100%",
    marginBottom: "9px",
    boxSizing: "border-box",
  },

  buttonArrow: {
    fontSize: "16px",
  },

  disabledButton: {
    opacity: 0.7,
    cursor: "not-allowed",
  },

  smallSpinner: {
    width: "13px",
    height: "13px",
    border: "2px solid rgba(255,255,255,0.4)",
    borderTopColor: "#ffffff",
    borderRadius: "50%",
    display: "inline-block",
  },

  successMessage: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    marginTop: "15px",
    padding: "11px",
    borderRadius: "9px",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#15803d",
    fontSize: "11px",
    lineHeight: "1.5",
  },

  errorMessage: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    marginTop: "15px",
    padding: "11px",
    borderRadius: "9px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    fontSize: "11px",
    lineHeight: "1.5",
  },

  messageCircle: {
    fontWeight: "800",
    flexShrink: 0,
  },

  noticeCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "26px",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
    minWidth: 0,
  },

  messageContainer: {
    maxWidth: "600px",
    margin: "100px auto",
    padding: "50px 30px",
    textAlign: "center",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    boxShadow: "0 15px 45px rgba(15, 23, 42, 0.07)",
  },

  messageContainerMobile: {
    margin: "60px 16px",
    padding: "35px 20px",
  },

  messageIcon: {
    fontSize: "36px",
    marginBottom: "15px",
  },

  messageTitle: {
    margin: "0 0 10px",
    color: "#1e293b",
    fontSize: "22px",
  },

  messageText: {
    margin: "0 0 24px",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.7",
  },

  spinner: {
    width: "30px",
    height: "30px",
    border: "3px solid #e0e7ff",
    borderTopColor: "#4f46e5",
    borderRadius: "50%",
    margin: "0 auto 18px",
  },

  removeResumeButton: {
    width: "28px",
    height: "28px",
    flexShrink: 0,
    border: "none",
    borderRadius: "8px",
    background: "#fee2e2",
    color: "#dc2626",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "800",
    cursor: "pointer",
    marginLeft: "auto",
  },
};

export default JobDetails;