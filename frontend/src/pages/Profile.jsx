import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getMyProfile,
  updateMyProfile,
} from "../services/api";

function Profile() {
  const { token, user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyProfile(token);

        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
        });

        updateUser(data.user);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

    setSuccess("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const data = await updateMyProfile(token, {
        name: formData.name.trim(),
      });

      updateUser(data.user);

      setFormData({
        name: data.user.name || "",
        email: data.user.email || "",
      });

      setSuccess("Profile updated successfully.");
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return (
      parts[0].charAt(0) +
      parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const getRoleName = () => {
    if (user?.role === "admin") return "Administrator";
    if (user?.role === "employer") return "Employer";
    return "Job Seeker";
  };

  const getAccountType = () => {
    if (user?.role === "admin") return "Administrator Account";
    if (user?.role === "employer") return "Employer Account";
    return "Job Seeker Account";
  };

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>

          <p style={styles.loadingText}>
            Loading profile...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        {/* ================= HEADER ================= */}

        <div style={styles.pageHeader}>
          <div>
            <div style={styles.eyebrow}>ACCOUNT</div>

            <h1 style={styles.title}>My Profile</h1>

            <p style={styles.subtitle}>
              Manage your CareerConnect account information.
            </p>
          </div>
        </div>

        {/* ================= MAIN CARD ================= */}

        <section style={styles.card}>
          {/* PROFILE HEADER */}

          <div
            style={{
              ...styles.profileHeader,
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "center",
              padding: isMobile ? "24px 18px" : "32px",
              gap: isMobile ? "15px" : "20px",
            }}
          >
            <div style={styles.avatar}>
              {getInitials(formData.name)}
            </div>

            <div style={styles.profileInfo}>
              <h2
                style={{
                  ...styles.profileName,
                  fontSize: isMobile ? "21px" : "24px",
                }}
              >
                {formData.name || "User"}
              </h2>

              <p style={styles.profileEmail}>
                {formData.email}
              </p>

              <div style={styles.roleBadge}>
                <span style={styles.roleDot}></span>
                {getRoleName()}
              </div>
            </div>
          </div>

          <div style={styles.divider}></div>

          {/* ================= PERSONAL INFORMATION ================= */}

          <form onSubmit={handleSubmit}>
            <div
              style={{
                ...styles.sectionHeader,
                padding: isMobile
                  ? "24px 18px 18px"
                  : "30px 32px 22px",
              }}
            >
              <div style={styles.sectionIcon}>
                👤
              </div>

              <div style={{ minWidth: 0 }}>
                <h3 style={styles.sectionTitle}>
                  Personal Information
                </h3>

                <p style={styles.sectionDescription}>
                  Update the information associated with
                  your account.
                </p>
              </div>
            </div>

            {/* MESSAGES */}

            {error && (
              <div
                style={{
                  ...styles.errorBox,
                  margin: isMobile
                    ? "0 18px 20px"
                    : "0 32px 20px",
                }}
              >
                <span style={styles.messageIcon}>
                  !
                </span>

                <span
                  style={{
                    overflowWrap: "anywhere",
                  }}
                >
                  {error}
                </span>
              </div>
            )}

            {success && (
              <div
                style={{
                  ...styles.successBox,
                  margin: isMobile
                    ? "0 18px 20px"
                    : "0 32px 20px",
                }}
              >
                <span style={styles.messageIcon}>
                  ✓
                </span>

                <span
                  style={{
                    overflowWrap: "anywhere",
                  }}
                >
                  {success}
                </span>
              </div>
            )}

            {/* FIELDS */}

            <div
              style={{
                ...styles.formGrid,
                padding: isMobile
                  ? "0 18px 24px"
                  : "0 32px 30px",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(2, minmax(0, 1fr))",
                gap: isMobile ? "18px" : "22px",
              }}
            >
              <div style={styles.formGroup}>
                <label
                  style={styles.label}
                  htmlFor="name"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  style={styles.input}
                  onFocus={(event) => {
                    event.target.style.borderColor =
                      "#2563eb";

                    event.target.style.boxShadow =
                      "0 0 0 3px rgba(37, 99, 235, 0.10)";
                  }}
                  onBlur={(event) => {
                    event.target.style.borderColor =
                      "#dbe3ef";

                    event.target.style.boxShadow = "none";
                  }}
                />

                <span style={styles.helperText}>
                  This name will be displayed across
                  CareerConnect.
                </span>
              </div>

              <div style={styles.formGroup}>
                <label
                  style={styles.label}
                  htmlFor="email"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled
                  style={{
                    ...styles.input,
                    ...styles.disabledInput,
                  }}
                />

                <span style={styles.helperText}>
                  Email address cannot be changed from
                  the profile page.
                </span>
              </div>
            </div>

            {/* ================= ACCOUNT INFORMATION ================= */}

            <div
              style={{
                ...styles.accountSection,
                margin: isMobile ? "0 18px" : "0 32px",
                padding: isMobile
                  ? "22px 0"
                  : "26px 0",
              }}
            >
              <div
                style={{
                  ...styles.accountHeader,
                  marginBottom: isMobile ? "18px" : "22px",
                }}
              >
                <div style={styles.sectionIcon}>
                  ⚙
                </div>

                <div style={{ minWidth: 0 }}>
                  <h3 style={styles.sectionTitle}>
                    Account Information
                  </h3>

                  <p style={styles.sectionDescription}>
                    Basic information about your
                    CareerConnect account.
                  </p>
                </div>
              </div>

              <div
                style={{
                  ...styles.accountGrid,
                  marginLeft: isMobile ? "0" : "51px",
                  gridTemplateColumns: isMobile
                    ? "1fr"
                    : "repeat(2, minmax(0, 1fr))",
                  gap: isMobile ? "12px" : "18px",
                }}
              >
                <div style={styles.accountItem}>
                  <span style={styles.accountLabel}>
                    ACCOUNT TYPE
                  </span>

                  <strong
                    style={{
                      ...styles.accountValue,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {getAccountType()}
                  </strong>
                </div>

                <div style={styles.accountItem}>
                  <span style={styles.accountLabel}>
                    ACCOUNT STATUS
                  </span>

                  <strong style={styles.activeStatus}>
                    <span style={styles.activeDot}></span>
                    Active
                  </strong>
                </div>
              </div>
            </div>

            {/* ================= ACTIONS ================= */}

            <div
              style={{
                ...styles.actions,
                padding: isMobile
                  ? "20px 18px 24px"
                  : "24px 32px 30px",
              }}
            >
              <button
                type="submit"
                disabled={saving}
                style={{
                  ...styles.saveButton,
                  width: isMobile ? "100%" : "auto",
                  ...(saving
                    ? styles.saveButtonDisabled
                    : {}),
                }}
              >
                {saving ? (
                  <>
                    <span
                      style={styles.buttonSpinner}
                    ></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <span>✓</span>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* ================= SECURITY NOTE ================= */}

        <div
          style={{
            ...styles.securityNote,
            padding: isMobile
              ? "14px 15px"
              : "16px 18px",
          }}
        >
          <span style={styles.securityIcon}>
            🔒
          </span>

          <div style={{ minWidth: 0 }}>
            <strong style={styles.securityTitle}>
              Your account information is secure
            </strong>

            <p style={styles.securityText}>
              CareerConnect keeps your personal account
              information protected.
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
      "linear-gradient(135deg, #f8fafc 0%, #eef4ff 100%)",
    padding: "45px 24px 60px",
    boxSizing: "border-box",
    overflowX: "hidden",
  },

  container: {
    width: "100%",
    maxWidth: "1050px",
    margin: "0 auto",
    boxSizing: "border-box",
  },

  pageHeader: {
    marginBottom: "28px",
  },

  eyebrow: {
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1.8px",
    color: "#2563eb",
    marginBottom: "8px",
  },

  title: {
    margin: 0,
    fontSize: "34px",
    lineHeight: "1.2",
    fontWeight: "800",
    color: "#0f172a",
    overflowWrap: "anywhere",
  },

  subtitle: {
    margin: "9px 0 0",
    fontSize: "15px",
    color: "#64748b",
    lineHeight: "1.5",
  },

  card: {
    width: "100%",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    boxShadow:
      "0 15px 40px rgba(15, 23, 42, 0.07)",
    overflow: "hidden",
    boxSizing: "border-box",
  },

  profileHeader: {
    display: "flex",
  },

  avatar: {
    width: "76px",
    height: "76px",
    flexShrink: 0,
    borderRadius: "20px",
    background:
      "linear-gradient(135deg, #2563eb, #4f46e5)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "800",
    boxShadow:
      "0 10px 24px rgba(37, 99, 235, 0.25)",
  },

  profileInfo: {
    flex: 1,
    minWidth: 0,
  },

  profileName: {
    margin: 0,
    fontWeight: "800",
    color: "#0f172a",
    overflowWrap: "anywhere",
  },

  profileEmail: {
    margin: "5px 0 10px",
    fontSize: "14px",
    color: "#64748b",
    wordBreak: "break-word",
  },

  roleBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    padding: "6px 11px",
    borderRadius: "999px",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontSize: "12px",
    fontWeight: "700",
    maxWidth: "100%",
    boxSizing: "border-box",
  },

  roleDot: {
    width: "7px",
    height: "7px",
    flexShrink: 0,
    borderRadius: "50%",
    background: "#2563eb",
  },

  divider: {
    height: "1px",
    background: "#e2e8f0",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "13px",
  },

  sectionIcon: {
    width: "38px",
    height: "38px",
    flexShrink: 0,
    borderRadius: "10px",
    background: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "17px",
  },

  sectionTitle: {
    margin: "1px 0 4px",
    fontSize: "17px",
    fontWeight: "800",
    color: "#0f172a",
  },

  sectionDescription: {
    margin: 0,
    fontSize: "13px",
    lineHeight: "1.5",
    color: "#64748b",
  },

  errorBox: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #fecaca",
    background: "#fef2f2",
    color: "#b91c1c",
    display: "flex",
    alignItems: "center",
    gap: "9px",
    fontSize: "13px",
    fontWeight: "600",
    boxSizing: "border-box",
  },

  successBox: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #bbf7d0",
    background: "#f0fdf4",
    color: "#15803d",
    display: "flex",
    alignItems: "center",
    gap: "9px",
    fontSize: "13px",
    fontWeight: "600",
    boxSizing: "border-box",
  },

  messageIcon: {
    width: "21px",
    height: "21px",
    flexShrink: 0,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.7)",
    fontSize: "12px",
    fontWeight: "800",
  },

  formGrid: {
    display: "grid",
    boxSizing: "border-box",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },

  label: {
    marginBottom: "8px",
    fontSize: "13px",
    fontWeight: "700",
    color: "#334155",
  },

  input: {
    width: "100%",
    height: "48px",
    boxSizing: "border-box",
    padding: "0 14px",
    border: "1px solid #dbe3ef",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#0f172a",
    fontSize: "14px",
    outline: "none",
    transition:
      "border-color 0.2s ease, box-shadow 0.2s ease",
  },

  disabledInput: {
    background: "#f8fafc",
    color: "#64748b",
    cursor: "not-allowed",
  },

  helperText: {
    marginTop: "7px",
    fontSize: "11px",
    lineHeight: "1.4",
    color: "#94a3b8",
  },

  accountSection: {
    boxSizing: "border-box",
    borderTop: "1px solid #e2e8f0",
    borderBottom: "1px solid #e2e8f0",
  },

  accountHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "13px",
  },

  accountGrid: {
    display: "grid",
    boxSizing: "border-box",
  },

  accountItem: {
    minWidth: 0,
    padding: "16px",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    background: "#f8fafc",
    display: "flex",
    flexDirection: "column",
    gap: "7px",
    boxSizing: "border-box",
  },

  accountLabel: {
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1px",
    color: "#94a3b8",
  },

  accountValue: {
    fontSize: "14px",
    color: "#334155",
  },

  activeStatus: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    fontSize: "14px",
    color: "#15803d",
  },

  activeDot: {
    width: "8px",
    height: "8px",
    flexShrink: 0,
    borderRadius: "50%",
    background: "#22c55e",
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    boxSizing: "border-box",
  },

  saveButton: {
    minWidth: "150px",
    height: "46px",
    border: "none",
    borderRadius: "10px",
    background:
      "linear-gradient(135deg, #2563eb, #4f46e5)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "0 20px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow:
      "0 8px 18px rgba(37, 99, 235, 0.20)",
    boxSizing: "border-box",
  },

  saveButtonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
    boxShadow: "none",
  },

  buttonSpinner: {
    width: "14px",
    height: "14px",
    border: "2px solid rgba(255,255,255,0.4)",
    borderTopColor: "#ffffff",
    borderRadius: "50%",
    display: "inline-block",
    flexShrink: 0,
  },

  securityNote: {
    marginTop: "18px",
    borderRadius: "12px",
    border: "1px solid #dbeafe",
    background: "#eff6ff",
    display: "flex",
    alignItems: "flex-start",
    gap: "11px",
    boxSizing: "border-box",
  },

  securityIcon: {
    fontSize: "17px",
    flexShrink: 0,
  },

  securityTitle: {
    display: "block",
    fontSize: "12px",
    color: "#1e3a8a",
    marginBottom: "3px",
  },

  securityText: {
    margin: 0,
    fontSize: "11px",
    color: "#3b82f6",
    lineHeight: "1.5",
  },

  loadingContainer: {
    minHeight: "60vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    boxSizing: "border-box",
  },

  spinner: {
    width: "38px",
    height: "38px",
    border: "4px solid #dbeafe",
    borderTopColor: "#2563eb",
    borderRadius: "50%",
    marginBottom: "14px",
  },

  loadingText: {
    margin: 0,
    fontSize: "14px",
    color: "#64748b",
    textAlign: "center",
  },
};

export default Profile;