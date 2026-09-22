import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getJobById, updateJob } from "../services/api";

function EditJob() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    requirements: "",
    salary: "",
    jobType: "Full-time",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        const job = await getJobById(id);

        setFormData({
          title: job.title || "",
          company: job.company || "",
          location: job.location || "",
          description: job.description || "",
          requirements: Array.isArray(job.requirements)
            ? job.requirements.join("\n")
            : "",
          salary: job.salary || "",
          jobType: job.jobType || "Full-time",
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (
      !formData.title.trim() ||
      !formData.company.trim() ||
      !formData.location.trim() ||
      !formData.description.trim() ||
      !formData.salary.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const requirements = formData.requirements
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    try {
      setSaving(true);

      await updateJob(token, id, {
        title: formData.title.trim(),
        company: formData.company.trim(),
        location: formData.location.trim(),
        description: formData.description.trim(),
        requirements,
        salary: formData.salary.trim(),
        jobType: formData.jobType,
      });

      navigate("/employer/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>

          <h2 style={styles.loadingTitle}>
            Loading Job Details
          </h2>

          <p style={styles.loadingText}>
            Please wait while we load the job information.
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
        <div style={styles.pageHeader}>
          <div>
            <div style={styles.eyebrow}>
              EMPLOYER
            </div>

            <h1 style={styles.pageTitle}>
              Edit Job
            </h1>

            <p style={styles.pageSubtitle}>
              Update your job posting and keep the
              information accurate for candidates.
            </p>
          </div>

          <div style={styles.headerIcon}>
            ✏️
          </div>
        </div>

        {/* ================= FORM ================= */}
        <form
          onSubmit={handleSubmit}
          style={styles.formCard}
        >
          {/* JOB INFORMATION */}
          <section style={styles.formSection}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionIcon}>
                📋
              </div>

              <div>
                <span style={styles.sectionEyebrow}>
                  BASIC INFORMATION
                </span>

                <h2 style={styles.sectionTitle}>
                  Job Information
                </h2>

                <p style={styles.sectionDescription}>
                  Update the basic details about the
                  position.
                </p>
              </div>
            </div>

            <div style={styles.formGrid}>
              {/* JOB TITLE */}
              <div style={styles.formGroup}>
                <label
                  htmlFor="title"
                  style={styles.label}
                >
                  Job Title{" "}
                  <span style={styles.required}>*</span>
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Full Stack Developer"
                  style={styles.input}
                />
              </div>

              {/* COMPANY */}
              <div style={styles.formGroup}>
                <label
                  htmlFor="company"
                  style={styles.label}
                >
                  Company{" "}
                  <span style={styles.required}>*</span>
                </label>

                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. CareerConnect"
                  style={styles.input}
                />
              </div>

              {/* LOCATION */}
              <div style={styles.formGroup}>
                <label
                  htmlFor="location"
                  style={styles.label}
                >
                  Location{" "}
                  <span style={styles.required}>*</span>
                </label>

                <div style={styles.inputWithIcon}>
                  <span style={styles.fieldIcon}>
                    📍
                  </span>

                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Remote, Delhi"
                    style={styles.inputWithIconField}
                  />
                </div>
              </div>

              {/* SALARY */}
              <div style={styles.formGroup}>
                <label
                  htmlFor="salary"
                  style={styles.label}
                >
                  Salary{" "}
                  <span style={styles.required}>*</span>
                </label>

                <div style={styles.inputWithIcon}>
                  <span style={styles.fieldIcon}>
                    💰
                  </span>

                  <input
                    id="salary"
                    name="salary"
                    type="text"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="e.g. 5-8 LPA"
                    style={styles.inputWithIconField}
                  />
                </div>
              </div>

              {/* JOB TYPE */}
              <div style={styles.formGroup}>
                <label
                  htmlFor="jobType"
                  style={styles.label}
                >
                  Job Type{" "}
                  <span style={styles.required}>*</span>
                </label>

                <select
                  id="jobType"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="Full-time">
                    Full-time
                  </option>

                  <option value="Part-time">
                    Part-time
                  </option>

                  <option value="Internship">
                    Internship
                  </option>

                  <option value="Contract">
                    Contract
                  </option>
                </select>
              </div>
            </div>
          </section>

          <div style={styles.divider}></div>

          {/* DESCRIPTION */}
          <section style={styles.formSection}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionIcon}>
                📝
              </div>

              <div>
                <span style={styles.sectionEyebrow}>
                  ROLE DETAILS
                </span>

                <h2 style={styles.sectionTitle}>
                  Job Description
                </h2>

                <p style={styles.sectionDescription}>
                  Update the role, responsibilities and
                  expectations.
                </p>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label
                htmlFor="description"
                style={styles.label}
              >
                Description{" "}
                <span style={styles.required}>*</span>
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the job, responsibilities and expectations..."
                rows="8"
                style={{
                  ...styles.textarea,
                  minHeight: "180px",
                }}
              />
            </div>
          </section>

          <div style={styles.divider}></div>

          {/* REQUIREMENTS */}
          <section style={styles.formSection}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionIcon}>
                ✓
              </div>

              <div>
                <span style={styles.sectionEyebrow}>
                  CANDIDATE PROFILE
                </span>

                <h2 style={styles.sectionTitle}>
                  Requirements
                </h2>

                <p style={styles.sectionDescription}>
                  Update the skills and qualifications
                  required for this position.
                </p>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label
                htmlFor="requirements"
                style={styles.label}
              >
                Required Skills & Qualifications
              </label>

              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder={`React.js
Node.js
MongoDB
REST API development
Git`}
                rows="8"
                style={styles.textarea}
              />

              <div style={styles.helperRow}>
                <span style={styles.helperIcon}>
                  💡
                </span>

                <small style={styles.helperText}>
                  Enter each skill or qualification on a
                  separate line.
                </small>
              </div>
            </div>
          </section>

          {/* ERROR */}
          {error && (
            <div style={styles.errorBox}>
              <span style={styles.errorIcon}>
                ⚠
              </span>

              <div>
                <strong style={styles.errorTitle}>
                  Unable to update job
                </strong>

                <p style={styles.errorText}>
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* ACTIONS */}
          <div style={styles.actions}>
            <button
              type="button"
              onClick={() =>
                navigate("/employer/dashboard")
              }
              style={styles.cancelButton}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              style={{
                ...styles.submitButton,
                ...(saving
                  ? styles.disabledButton
                  : {}),
              }}
            >
              {saving ? (
                <>
                  <span style={styles.spinner}></span>
                  Saving Changes...
                </>
              ) : (
                <>
                  Save Changes
                  <span style={styles.arrow}>
                    →
                  </span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* TIP */}
        <div style={styles.tipCard}>
          <div style={styles.tipIcon}>
            💡
          </div>

          <div>
            <strong style={styles.tipTitle}>
              Keep your job posting updated
            </strong>

            <p style={styles.tipText}>
              Make sure the role description, salary,
              location and requirements accurately reflect
              the current position.
            </p>
          </div>
        </div>
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
    maxWidth: "1050px",
    margin: "0 auto",
    padding: "42px 24px 0",
    position: "relative",
    zIndex: 1,
  },

  pageHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "25px",
    marginBottom: "25px",
  },

  eyebrow: {
    display: "inline-block",
    marginBottom: "7px",
    color: "#6366f1",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1.2px",
  },

  pageTitle: {
    margin: 0,
    color: "#111827",
    fontSize: "34px",
    lineHeight: "1.2",
    letterSpacing: "-0.8px",
    fontWeight: "800",
  },

  pageSubtitle: {
    margin: "9px 0 0",
    color: "#64748b",
    fontSize: "13px",
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

  formCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "22px",
    boxShadow:
      "0 15px 45px rgba(15, 23, 42, 0.07)",
    overflow: "hidden",
  },

  formSection: {
    padding: "30px 34px",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "13px",
    marginBottom: "25px",
  },

  sectionIcon: {
    width: "42px",
    height: "42px",
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

  sectionTitle: {
    margin: 0,
    color: "#1e293b",
    fontSize: "19px",
    fontWeight: "800",
  },

  sectionDescription: {
    margin: "5px 0 0",
    color: "#94a3b8",
    fontSize: "11px",
    lineHeight: "1.5",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "20px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },

  label: {
    marginBottom: "7px",
    color: "#334155",
    fontSize: "12px",
    fontWeight: "700",
  },

  required: {
    color: "#ef4444",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #dbe2ea",
    borderRadius: "10px",
    padding: "12px 13px",
    background: "#ffffff",
    color: "#334155",
    fontSize: "13px",
    outline: "none",
  },

  inputWithIcon: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #dbe2ea",
    borderRadius: "10px",
    background: "#ffffff",
    overflow: "hidden",
  },

  fieldIcon: {
    paddingLeft: "12px",
    fontSize: "13px",
  },

  inputWithIconField: {
    flex: 1,
    minWidth: 0,
    border: "none",
    outline: "none",
    padding: "12px 10px",
    background: "transparent",
    color: "#334155",
    fontSize: "13px",
  },

  select: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #dbe2ea",
    borderRadius: "10px",
    padding: "12px 13px",
    background: "#ffffff",
    color: "#334155",
    fontSize: "13px",
    outline: "none",
    cursor: "pointer",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #dbe2ea",
    borderRadius: "10px",
    padding: "13px",
    background: "#ffffff",
    color: "#334155",
    fontSize: "13px",
    lineHeight: "1.65",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },

  divider: {
    height: "1px",
    background: "#eef2f7",
    margin: "0 34px",
  },

  helperRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginTop: "8px",
  },

  helperIcon: {
    fontSize: "11px",
  },

  helperText: {
    color: "#94a3b8",
    fontSize: "10px",
  },

  errorBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "11px",
    margin: "0 34px 25px",
    padding: "13px",
    borderRadius: "10px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
  },

  errorIcon: {
    width: "25px",
    height: "25px",
    borderRadius: "50%",
    background: "#fee2e2",
    color: "#dc2626",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: "800",
    flexShrink: 0,
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
    fontSize: "11px",
    lineHeight: "1.5",
  },

  actions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "10px",
    padding: "20px 34px",
    background: "#f8fafc",
    borderTop: "1px solid #eef2f7",
  },

  cancelButton: {
    border: "1px solid #dbe2ea",
    background: "#ffffff",
    color: "#475569",
    padding: "12px 20px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },

  submitButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    border: "none",
    background:
      "linear-gradient(135deg, #4f46e5, #2563eb)",
    color: "#ffffff",
    padding: "12px 22px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow:
      "0 7px 18px rgba(79, 70, 229, 0.18)",
  },

  arrow: {
    fontSize: "16px",
  },

  disabledButton: {
    opacity: 0.7,
    cursor: "not-allowed",
  },

  spinner: {
    width: "13px",
    height: "13px",
    border: "2px solid rgba(255,255,255,0.4)",
    borderTopColor: "#ffffff",
    borderRadius: "50%",
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

  tipCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    marginTop: "20px",
    padding: "16px 18px",
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
};

export default EditJob;