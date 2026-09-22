import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await fetch(`${API_URL}/admin/users`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch users"
          );
        }

        setUsers(data.users || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredUsers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !searchValue ||
        user.name?.toLowerCase().includes(searchValue) ||
        user.email?.toLowerCase().includes(searchValue);

      const matchesRole =
        roleFilter === "all" ||
        user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <p style={styles.loading}>Loading users...</p>
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

            <h1 style={styles.title}>User Management</h1>

            <p style={styles.subtitle}>
              View and search all registered CareerConnect users.
            </p>
          </div>

          <div style={styles.totalBox}>
            <span style={styles.totalLabel}>
              Total Users
            </span>

            <strong style={styles.totalValue}>
              {users.length}
            </strong>
          </div>
        </div>

        {/* Filters */}
        <div style={styles.filterCard}>
          <div style={styles.searchWrapper}>
            <span style={styles.searchIcon}>🔎</span>

            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              style={styles.searchInput}
            />
          </div>

          <select
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(event.target.value)
            }
            style={styles.select}
          >
            <option value="all">All Roles</option>
            <option value="jobseeker">Jobseekers</option>
            <option value="employer">Employers</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        {/* Result Count */}
        <div style={styles.resultInfo}>
          Showing{" "}
          <strong>{filteredUsers.length}</strong>{" "}
          of{" "}
          <strong>{users.length}</strong> users
        </div>

        {/* Users Table */}
        <div style={styles.tableCard}>
          {filteredUsers.length === 0 ? (
            <div style={styles.empty}>
              {users.length === 0
                ? "No users found."
                : "No users match your search or selected role."}
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Role</th>
                    <th style={styles.th}>Registered</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                        key={user._id}
                        onClick={() => navigate(`/admin/users/${user._id}`)}
                        style={styles.tableRow}
                    >
                      <td style={styles.td}>
                        <div style={styles.nameCell}>
                          <div style={styles.avatar}>
                            {user.name
                              ?.charAt(0)
                              ?.toUpperCase() || "U"}
                          </div>

                          <span style={styles.clickableName}>
                            {user.name}
                            </span>
                        </div>
                      </td>

                      <td style={styles.td}>
                        {user.email}
                      </td>

                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.roleBadge,
                            ...(user.role === "admin"
                              ? styles.adminBadge
                              : user.role === "employer"
                              ? styles.employerBadge
                              : styles.jobseekerBadge),
                          }}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td style={styles.td}>
                        {formatDate(user.createdAt)}
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
    maxWidth: "1200px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "20px",
    marginBottom: "25px",
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
    minWidth: "130px",
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

  clickableName: {
    color: "#2563eb",
    fontWeight: "600",
  },

  /* Filters */
  filterCard: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "16px",
    marginBottom: "12px",
    flexWrap: "wrap",
  },

  searchWrapper: {
    flex: 1,
    minWidth: "250px",
    position: "relative",
  },

  searchIcon: {
    position: "absolute",
    left: "13px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "15px",
    pointerEvents: "none",
  },

  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 14px 11px 40px",
    border: "1px solid #cbd5e1",
    borderRadius: "9px",
    outline: "none",
    fontSize: "14px",
    color: "#0f172a",
    background: "#ffffff",
  },

  select: {
    minWidth: "170px",
    padding: "11px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "9px",
    outline: "none",
    fontSize: "14px",
    color: "#334155",
    background: "#ffffff",
    cursor: "pointer",
  },

  resultInfo: {
    fontSize: "13px",
    color: "#64748b",
    marginBottom: "12px",
  },

  /* Table */
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
    minWidth: "700px",
  },

  tableRow: {
    cursor: "pointer",
    transition: "background 0.2s ease",
  },

  th: {
    textAlign: "left",
    padding: "16px 20px",
    background: "#f8fafc",
    color: "#475569",
    fontSize: "13px",
    fontWeight: "700",
    borderBottom: "1px solid #e2e8f0",
  },

  td: {
    padding: "17px 20px",
    color: "#334155",
    fontSize: "14px",
    borderBottom: "1px solid #f1f5f9",
  },

  nameCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontWeight: "600",
    color: "#0f172a",
  },

  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#dbeafe",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
  },

  roleBadge: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "capitalize",
  },

  adminBadge: {
    background: "#ede9fe",
    color: "#6d28d9",
  },

  employerBadge: {
    background: "#dcfce7",
    color: "#15803d",
  },

  jobseekerBadge: {
    background: "#dbeafe",
    color: "#1d4ed8",
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

export default AdminUsers;