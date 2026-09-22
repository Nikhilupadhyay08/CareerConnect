import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const AdminUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication required");
        }

        // Get all users from the existing admin endpoint
        const response = await fetch(`${API_URL}/admin/users`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch user"
          );
        }

        const foundUser = data.users?.find(
          (item) => item._id === id
        );

        if (!foundUser) {
          throw new Error("User not found");
        }

        setUser(foundUser);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getRoleStyle = (role) => {
    if (role === "admin") {
      return {
        background: "#ede9fe",
        color: "#6d28d9",
      };
    }

    if (role === "employer") {
      return {
        background: "#dcfce7",
        color: "#15803d",
      };
    }

    return {
      background: "#dbeafe",
      color: "#1d4ed8",
    };
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <p style={styles.loading}>
            Loading user details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.error}>{error}</div>

          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            style={styles.backButton}
          >
            ← Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Back */}
        <Link to="/admin/users" style={styles.backLink}>
          ← Back to Users
        </Link>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.avatar}>
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div>
            <p style={styles.label}>USER DETAILS</p>

            <h1 style={styles.title}>{user.name}</h1>

            <p style={styles.email}>{user.email}</p>
          </div>
        </div>

        {/* Details Card */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            Account Information
          </h2>

          <div style={styles.detailsGrid}>
            <DetailItem
              label="Full Name"
              value={user.name || "N/A"}
            />

            <DetailItem
              label="Email Address"
              value={user.email || "N/A"}
            />

            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>
                Role
              </span>

              <span
                style={{
                  ...styles.roleBadge,
                  ...getRoleStyle(user.role),
                }}
              >
                {user.role}
              </span>
            </div>

            <DetailItem
              label="Registered On"
              value={formatDate(user.createdAt)}
            />

            <DetailItem
              label="Last Updated"
              value={formatDate(user.updatedAt)}
            />

            <DetailItem
              label="User ID"
              value={user._id || "N/A"}
              monospace
            />
          </div>
        </div>

        {/* Security Information */}
        <div style={styles.securityCard}>
          <div style={styles.securityIcon}>🔒</div>

          <div>
            <h3 style={styles.securityTitle}>
              Account Security
            </h3>

            <p style={styles.securityText}>
              Password and authentication credentials are not
              displayed in the admin panel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({
  label,
  value,
  monospace = false,
}) => {
  return (
    <div style={styles.detailItem}>
      <span style={styles.detailLabel}>{label}</span>

      <span
        style={{
          ...styles.detailValue,
          ...(monospace ? styles.monospace : {}),
        }}
      >
        {value}
      </span>
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
    maxWidth: "900px",
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
    alignItems: "center",
    gap: "20px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "28px",
    marginBottom: "20px",
    boxShadow:
      "0 4px 12px rgba(15, 23, 42, 0.05)",
  },

  avatar: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    background: "#dbeafe",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    fontWeight: "800",
    flexShrink: 0,
  },

  label: {
    margin: "0 0 5px",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    color: "#2563eb",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "800",
    color: "#0f172a",
  },

  email: {
    margin: "6px 0 0",
    fontSize: "15px",
    color: "#64748b",
  },

  card: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "28px",
    boxShadow:
      "0 4px 12px rgba(15, 23, 42, 0.05)",
  },

  cardTitle: {
    margin: "0 0 25px",
    fontSize: "20px",
    fontWeight: "700",
    color: "#0f172a",
  },

  detailsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "22px",
  },

  detailItem: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
    minWidth: 0,
  },

  detailLabel: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  detailValue: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#0f172a",
    wordBreak: "break-word",
  },

  monospace: {
    fontFamily: "monospace",
    fontSize: "13px",
    color: "#475569",
  },

  roleBadge: {
    display: "inline-block",
    width: "fit-content",
    padding: "6px 11px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "capitalize",
  },

  securityCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "20px",
    marginTop: "20px",
  },

  securityIcon: {
    fontSize: "22px",
  },

  securityTitle: {
    margin: "0 0 5px",
    fontSize: "15px",
    fontWeight: "700",
    color: "#334155",
  },

  securityText: {
    margin: 0,
    fontSize: "13px",
    lineHeight: "1.5",
    color: "#64748b",
  },

  backButton: {
    marginTop: "20px",
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
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

export default AdminUserDetails;