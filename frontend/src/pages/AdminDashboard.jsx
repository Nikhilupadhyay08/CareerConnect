import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await fetch(`${API_URL}/admin/stats`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load admin statistics"
          );
        }

        setStats(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <p style={styles.loading}>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.error}>{error}</div>
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
            <p style={styles.label}>ADMIN PANEL</p>

            <h1 style={styles.title}>Admin Dashboard</h1>

            <p style={styles.subtitle}>
              Monitor and manage your CareerConnect platform.
            </p>
          </div>
        </div>

        {/* User Statistics */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Users</h2>

          <div style={styles.grid}>
            <StatCard
              title="Total Users"
              value={stats.users.total}
              icon="👥"
            />

            <StatCard
              title="Jobseekers"
              value={stats.users.jobseekers}
              icon="🔎"
            />

            <StatCard
              title="Employers"
              value={stats.users.employers}
              icon="🏢"
            />

            <StatCard
              title="Admins"
              value={stats.users.admins}
              icon="🛡️"
            />
          </div>
        </section>

        {/* Platform Statistics */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Platform Overview</h2>

          <div style={styles.grid}>
            <StatCard
              title="Total Jobs"
              value={stats.jobs.total}
              icon="💼"
            />

            <StatCard
              title="Total Applications"
              value={stats.applications.total}
              icon="📄"
            />

            <StatCard
              title="Shortlisted"
              value={stats.applications.shortlisted}
              icon="⭐"
            />

            <StatCard
              title="Hired"
              value={stats.applications.hired}
              icon="✅"
            />
          </div>
        </section>

        {/* Application Status */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Application Status</h2>

          <div style={styles.statusGrid}>
            <StatusCard
              title="Applied"
              value={stats.applications.applied}
            />

            <StatusCard
              title="Shortlisted"
              value={stats.applications.shortlisted}
            />

            <StatusCard
              title="Rejected"
              value={stats.applications.rejected}
            />

            <StatusCard
              title="Hired"
              value={stats.applications.hired}
            />
          </div>
        </section>

        {/* Quick Actions */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Quick Actions</h2>

          <div style={styles.actionGrid}>
            <Link
              to="/admin/users"
              style={styles.actionCard}
            >
              <div style={styles.actionIcon}>👥</div>

              <div>
                <h3 style={styles.actionTitle}>
                  Manage Users
                </h3>

                <p style={styles.actionText}>
                  View and manage all registered users.
                </p>
              </div>

              <span style={styles.arrow}>→</span>
            </Link>

            <Link
              to="/admin/jobs"
              style={styles.actionCard}
            >
              <div style={styles.actionIcon}>💼</div>

              <div>
                <h3 style={styles.actionTitle}>
                  Manage Jobs
                </h3>

                <p style={styles.actionText}>
                  View and manage jobs posted on the platform.
                </p>
              </div>

              <span style={styles.arrow}>→</span>
            </Link>

            <Link
              to="/admin/applications"
              style={styles.actionCard}
            >
              <div style={styles.actionIcon}>📄</div>

              <div>
                <h3 style={styles.actionTitle}>
                  Manage Applications
                </h3>

                <p style={styles.actionText}>
                  Review applications and applicant information.
                </p>
              </div>

              <span style={styles.arrow}>→</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => {
  return (
    <div style={styles.card}>
      <div style={styles.cardTop}>
        <span style={styles.icon}>{icon}</span>

        <span style={styles.cardTitle}>{title}</span>
      </div>

      <div style={styles.value}>{value}</div>
    </div>
  );
};

const StatusCard = ({ title, value }) => {
  return (
    <div style={styles.statusCard}>
      <span style={styles.statusTitle}>{title}</span>

      <strong style={styles.statusValue}>{value}</strong>
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
    maxWidth: "1200px",
    margin: "0 auto",
  },

  header: {
    marginBottom: "35px",
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

  section: {
    marginBottom: "35px",
  },

  sectionTitle: {
    margin: "0 0 18px",
    fontSize: "22px",
    fontWeight: "700",
    color: "#0f172a",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
  },

  card: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "24px",
    boxShadow:
      "0 4px 12px rgba(15, 23, 42, 0.05)",
  },

  cardTop: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  },

  icon: {
    fontSize: "24px",
  },

  cardTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#64748b",
  },

  value: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#0f172a",
  },

  statusGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },

  statusCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "20px 22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow:
      "0 3px 10px rgba(15, 23, 42, 0.04)",
  },

  statusTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#475569",
  },

  statusValue: {
    fontSize: "24px",
    color: "#2563eb",
  },

  /* Quick Actions */
  actionGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "18px",
  },

  actionCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    position: "relative",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "22px",
    textDecoration: "none",
    boxShadow:
      "0 4px 12px rgba(15, 23, 42, 0.05)",
    transition: "transform 0.2s ease",
  },

  actionIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eff6ff",
    fontSize: "24px",
    flexShrink: 0,
  },

  actionTitle: {
    margin: "0 0 5px",
    fontSize: "16px",
    fontWeight: "700",
    color: "#0f172a",
  },

  actionText: {
    margin: 0,
    fontSize: "13px",
    lineHeight: "1.5",
    color: "#64748b",
  },

  arrow: {
    marginLeft: "auto",
    fontSize: "22px",
    color: "#2563eb",
    flexShrink: 0,
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

export default AdminDashboard;