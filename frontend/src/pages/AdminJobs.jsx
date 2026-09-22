import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const AdminJobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await fetch(`${API_URL}/admin/jobs`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch jobs"
          );
        }

        setJobs(data.jobs || []);
      } catch (error) {
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Format date
  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Filter jobs
  const filteredJobs = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch =
        !searchValue ||
        job.title?.toLowerCase().includes(searchValue) ||
        job.company?.toLowerCase().includes(searchValue) ||
        job.location?.toLowerCase().includes(searchValue);

      const matchesJobType =
        jobTypeFilter === "all" ||
        job.jobType === jobTypeFilter;

      return matchesSearch && matchesJobType;
    });
  }, [jobs, search, jobTypeFilter]);

  // Loading state
  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loadingContainer}>
            <p style={styles.loadingText}>
              Loading jobs...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.error}>
            {error}
          </div>
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
            <p style={styles.label}>
              ADMIN PANEL
            </p>

            <h1 style={styles.title}>
              Job Management
            </h1>

            <p style={styles.subtitle}>
              View and manage all jobs posted on CareerConnect.
            </p>
          </div>

          <div style={styles.totalBox}>
            <span style={styles.totalLabel}>
              Total Jobs
            </span>

            <strong style={styles.totalValue}>
              {jobs.length}
            </strong>
          </div>
        </div>

        {/* Filters */}
        <div style={styles.filterCard}>

          {/* Search */}
          <div style={styles.searchWrapper}>
            <span style={styles.searchIcon}>
              🔎
            </span>

            <input
              type="text"
              placeholder="Search by job, company, or location..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              style={styles.searchInput}
            />
          </div>

          {/* Job Type */}
          <select
            value={jobTypeFilter}
            onChange={(event) =>
              setJobTypeFilter(event.target.value)
            }
            style={styles.select}
          >
            <option value="all">
              All Job Types
            </option>

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

        {/* Result Count */}
        <div style={styles.resultInfo}>
          Showing{" "}
          <strong>
            {filteredJobs.length}
          </strong>{" "}
          of{" "}
          <strong>
            {jobs.length}
          </strong>{" "}
          jobs
        </div>

        {/* Jobs Table */}
        <div style={styles.tableCard}>

          {filteredJobs.length === 0 ? (
            <div style={styles.empty}>
              {jobs.length === 0
                ? "No jobs found."
                : "No jobs match your search or selected job type."}
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>

                {/* Table Header */}
                <thead>
                  <tr>
                    <th style={styles.th}>
                      Job
                    </th>

                    <th style={styles.th}>
                      Company
                    </th>

                    <th style={styles.th}>
                      Location
                    </th>

                    <th style={styles.th}>
                      Type
                    </th>

                    <th style={styles.th}>
                      Salary
                    </th>

                    <th style={styles.th}>
                      Employer
                    </th>

                    <th style={styles.th}>
                      Posted
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {filteredJobs.map((job) => (
                    <tr
                      key={job._id}
                      onClick={() =>
                        navigate(
                          `/admin/jobs/${job._id}`
                        )
                      }
                      style={styles.tableRow}
                      onMouseEnter={(event) => {
                        event.currentTarget.style.background =
                          "#f8fafc";
                      }}
                      onMouseLeave={(event) => {
                        event.currentTarget.style.background =
                          "#ffffff";
                      }}
                    >

                      {/* Job */}
                      <td style={styles.td}>
                        <div style={styles.jobTitle}>
                          {job.title}
                        </div>

                        <div style={styles.viewDetails}>
                          View details →
                        </div>
                      </td>

                      {/* Company */}
                      <td style={styles.td}>
                        {job.company || "N/A"}
                      </td>

                      {/* Location */}
                      <td style={styles.td}>
                        {job.location || "N/A"}
                      </td>

                      {/* Job Type */}
                      <td style={styles.td}>
                        <span style={styles.typeBadge}>
                          {job.jobType || "N/A"}
                        </span>
                      </td>

                      {/* Salary */}
                      <td style={styles.td}>
                        {job.salary || "Not specified"}
                      </td>

                      {/* Employer */}
                      <td style={styles.td}>
                        <div style={styles.employerName}>
                          {job.employer?.name || "N/A"}
                        </div>

                        <div style={styles.employerEmail}>
                          {job.employer?.email || ""}
                        </div>
                      </td>

                      {/* Posted */}
                      <td style={styles.td}>
                        {formatDate(job.createdAt)}
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
    maxWidth: "1400px",
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
    minWidth: "280px",
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
    minWidth: "1100px",
  },

  th: {
    textAlign: "left",
    padding: "16px 18px",
    background: "#f8fafc",
    color: "#475569",
    fontSize: "13px",
    fontWeight: "700",
    borderBottom: "1px solid #e2e8f0",
    whiteSpace: "nowrap",
  },

  tableRow: {
    cursor: "pointer",
    background: "#ffffff",
    transition: "background 0.15s ease",
  },

  td: {
    padding: "17px 18px",
    color: "#334155",
    fontSize: "14px",
    borderBottom: "1px solid #f1f5f9",
    verticalAlign: "top",
  },

  jobTitle: {
    fontWeight: "700",
    color: "#0f172a",
    minWidth: "180px",
  },

  viewDetails: {
    marginTop: "5px",
    fontSize: "12px",
    color: "#2563eb",
    fontWeight: "600",
  },

  typeBadge: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "999px",
    background: "#dbeafe",
    color: "#1d4ed8",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  employerName: {
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: "3px",
  },

  employerEmail: {
    fontSize: "12px",
    color: "#64748b",
  },

  empty: {
    padding: "50px 20px",
    textAlign: "center",
    color: "#64748b",
    fontSize: "14px",
  },

  loadingContainer: {
    padding: "80px 0",
    textAlign: "center",
  },

  loadingText: {
    margin: 0,
    color: "#64748b",
    fontSize: "15px",
  },

  error: {
    padding: "18px",
    borderRadius: "10px",
    background: "#fee2e2",
    color: "#b91c1c",
    textAlign: "center",
  },
};

export default AdminJobs;