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
          <p style={styles.loadingText}>Loading profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.pageHeader}>
          <div>
            <div style={styles.eyebrow}>ACCOUNT</div>

            <h1 style={styles.title}>My Profile</h1>

            <p style={styles.subtitle}>
              Manage your CareerConnect account information.
            </p>
          </div>
        </div>

        {/* Main Card */}
        <section style={styles.card}>

          {/* Profile Header */}
          <div style={styles.profileHeader}>

            <div style={styles.avatar}>
              {getInitials(formData.name)}
            </div>

            <div style={styles.profileInfo}>
              <h2 style={styles.profileName}>
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

          {/* Form */}
          <form onSubmit={handleSubmit}>

            <div style={styles.sectionHeader}>
              <div style={styles.sectionIcon}>
                👤
              </div>

              <div>
                <h3 style={styles.sectionTitle}>
                  Personal Information
                </h3>

                <p style={styles.sectionDescription}>
                  Update the information associated with
                  your account.
                </p>
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div style={styles.errorBox}>
                <span style={styles.messageIcon}>!</span>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div style={styles.successBox}>
                <span style={styles.messageIcon}>✓</span>
                <span>{success}</span>
              </div>
            )}

            {/* Fields */}
            <div style={styles.formGrid}>

              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="name">
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
                  onFocus={(e) => {
                    e.target.style.borderColor = "#2563eb";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(37, 99, 235, 0.10)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#dbe3ef";
                    e.target.style.boxShadow = "none";
                  }}
                />

                <span style={styles.helperText}>
                  This name will be displayed across
                  CareerConnect.
                </span>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="email">
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

            {/* Account Information */}
            <div style={styles.accountSection}>

              <div style={styles.accountHeader}>
                <div style={styles.sectionIcon}>
                  ⚙
                </div>

                <div>
                  <h3 style={styles.sectionTitle}>
                    Account Information
                  </h3>

                  <p style={styles.sectionDescription}>
                    Basic information about your
                    CareerConnect account.
                  </p>
                </div>
              </div>

              <div style={styles.accountGrid}>

                <div style={styles.accountItem}>
                  <span style={styles.accountLabel}>
                    ACCOUNT TYPE
                  </span>

                  <strong style={styles.accountValue}>
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

            {/* Actions */}
            <div style={styles.actions}>

              <button
                type="submit"
                disabled={saving}
                style={{
                  ...styles.saveButton,
                  ...(saving
                    ? styles.saveButtonDisabled
                    : {}),
                }}
              >
                {saving ? (
                  <>
                    <span style={styles.buttonSpinner}></span>
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

        {/* Bottom Note */}
        <div style={styles.securityNote}>
          <span style={styles.securityIcon}>🔒</span>

          <div>
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
  },

  container: {
    width: "100%",
    maxWidth: "1050px",
    margin: "0 auto",
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
  },

  subtitle: {
    margin: "9px 0 0",
    fontSize: "15px",
    color: "#64748b",
  },

  card: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    boxShadow: "0 15px 40px rgba(15, 23, 42, 0.07)",
    overflow: "hidden",
  },

  profileHeader: {
    padding: "32px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
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
    fontSize: "24px",
    fontWeight: "800",
    color: "#0f172a",
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
  },

  roleDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#2563eb",
  },

  divider: {
    height: "1px",
    background: "#e2e8f0",
  },

  sectionHeader: {
    padding: "30px 32px 22px",
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
    margin: "0 32px 20px",
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
  },

  successBox: {
    margin: "0 32px 20px",
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
    padding: "0 32px 30px",
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "22px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
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
    margin: "0 32px",
    padding: "26px 0",
    borderTop: "1px solid #e2e8f0",
    borderBottom: "1px solid #e2e8f0",
  },

  accountHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "13px",
    marginBottom: "22px",
  },

  accountGrid: {
    marginLeft: "51px",
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "18px",
  },

  accountItem: {
    padding: "16px",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    background: "#f8fafc",
    display: "flex",
    flexDirection: "column",
    gap: "7px",
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
    borderRadius: "50%",
    background: "#22c55e",
  },

  actions: {
    padding: "24px 32px 30px",
    display: "flex",
    justifyContent: "flex-end",
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
  },

  securityNote: {
    marginTop: "18px",
    padding: "16px 18px",
    borderRadius: "12px",
    border: "1px solid #dbeafe",
    background: "#eff6ff",
    display: "flex",
    alignItems: "flex-start",
    gap: "11px",
  },

  securityIcon: {
    fontSize: "17px",
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
  },
};

export default Profile;