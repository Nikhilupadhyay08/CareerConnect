import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllJobs } from "../services/api";

function Jobs() {
  const JOBS_PER_PAGE = 6;

  const defaultFilters = {
    search: "",
    location: "",
    jobType: "",
    sort: "newest",
  };

  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const [pagination, setPagination] = useState({
    totalJobs: 0,
    totalPages: 1,
    jobsPerPage: JOBS_PER_PAGE,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth <= 768
  );

  // ==================== RESPONSIVE ====================

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // ==================== FETCH JOBS ====================

  const fetchJobs = async (
    currentFilters = filters,
    page = currentPage
  ) => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllJobs({
        ...currentFilters,
        page,
        limit: JOBS_PER_PAGE,
      });

      setJobs(data.jobs || []);

      setPagination({
        totalJobs: data.totalJobs || 0,
        totalPages: data.totalPages || 1,
        jobsPerPage: data.jobsPerPage || JOBS_PER_PAGE,
        hasNextPage: Boolean(data.hasNextPage),
        hasPreviousPage: Boolean(data.hasPreviousPage),
      });
    } catch (err) {
      setError(
        err.message || "Failed to load jobs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================== INITIAL LOAD ====================

  useEffect(() => {
    fetchJobs(defaultFilters, 1);
  }, []);

  // ==================== HANDLERS ====================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSearch = (event) => {
    event.preventDefault();

    setCurrentPage(1);
    fetchJobs(filters, 1);
  };

  const handleClear = () => {
    setFilters(defaultFilters);
    setCurrentPage(1);
    fetchJobs(defaultFilters, 1);
  };

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > pagination.totalPages
    ) {
      return;
    }

    setCurrentPage(page);
    fetchJobs(filters, page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==================== HELPERS ====================

  const getCompanyInitial = (company) => {
    if (!company) return "C";

    return company.trim().charAt(0).toUpperCase();
  };

  const getJobTypeStyle = (jobType) => {
    switch (jobType) {
      case "Full-time":
        return {
          background: "#eff6ff",
          color: "#1d4ed8",
        };

      case "Part-time":
        return {
          background: "#f5f3ff",
          color: "#6d28d9",
        };

      case "Internship":
        return {
          background: "#ecfdf5",
          color: "#047857",
        };

      case "Contract":
        return {
          background: "#fff7ed",
          color: "#c2410c",
        };

      default:
        return {
          background: "#f1f5f9",
          color: "#475569",
        };
    }
  };

  // ==================== RESPONSIVE STYLES ====================

  const responsiveStyles = {
    hero: {
      ...styles.hero,
      padding: isMobile
        ? "48px 20px 30px"
        : styles.hero.padding,
    },

    heading: {
      ...styles.heading,
      fontSize: isMobile ? "38px" : styles.heading.fontSize,
      lineHeight: isMobile ? "1.08" : styles.heading.lineHeight,
      letterSpacing: isMobile
        ? "-1.5px"
        : styles.heading.letterSpacing,
    },

    heroDescription: {
      ...styles.heroDescription,
      fontSize: isMobile ? "14px" : styles.heroDescription.fontSize,
      lineHeight: isMobile ? "1.65" : styles.heroDescription.lineHeight,
      marginTop: isMobile ? "16px" : styles.heroDescription.margin,
    },

    heroStats: {
      ...styles.heroStats,
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "stretch" : "center",
      gap: isMobile ? "12px" : styles.heroStats.gap,
      marginTop: isMobile ? "24px" : styles.heroStats.marginTop,
    },

    heroStat: {
      ...styles.heroStat,
      width: isMobile ? "100%" : "auto",
    },

    heroStatDivider: {
      ...styles.heroStatDivider,
      display: isMobile ? "none" : "block",
    },

    searchSection: {
      ...styles.searchSection,
      padding: isMobile ? "0 16px" : styles.searchSection.padding,
    },

    searchCard: {
      ...styles.searchCard,
      padding: isMobile ? "20px 16px" : styles.searchCard.padding,
      borderRadius: isMobile ? "16px" : styles.searchCard.borderRadius,
      width: "100%",
      boxSizing: "border-box",
    },

    searchHeader: {
      ...styles.searchHeader,
      marginBottom: isMobile ? "20px" : styles.searchHeader.marginBottom,
    },

    searchTitle: {
      ...styles.searchTitle,
      fontSize: isMobile ? "18px" : styles.searchTitle.fontSize,
    },

    searchSubtitle: {
      ...styles.searchSubtitle,
      fontSize: isMobile ? "11px" : styles.searchSubtitle.fontSize,
      maxWidth: isMobile ? "230px" : "none",
      lineHeight: isMobile ? "1.5" : "normal",
    },

    searchGrid: {
      ...styles.searchGrid,
      gridTemplateColumns: isMobile
        ? "minmax(0, 1fr)"
        : styles.searchGrid.gridTemplateColumns,
      gap: isMobile ? "13px" : styles.searchGrid.gap,
    },

    inputWrapper: {
      ...styles.inputWrapper,
      width: "100%",
      boxSizing: "border-box",
    },

    input: {
      ...styles.input,
      boxSizing: "border-box",
    },

    select: {
      ...styles.select,
      boxSizing: "border-box",
    },

    searchActions: {
      ...styles.searchActions,
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "stretch" : "center",
      gap: isMobile ? "10px" : styles.searchActions.gap,
    },

    searchButton: {
      ...styles.searchButton,
      width: isMobile ? "100%" : "auto",
      justifyContent: "center",
    },

    clearButton: {
      ...styles.clearButton,
      width: isMobile ? "100%" : "auto",
    },

    resultsSection: {
      ...styles.resultsSection,
      padding: isMobile
        ? "42px 16px 0"
        : styles.resultsSection.padding,
    },

    resultsHeader: {
      ...styles.resultsHeader,
      alignItems: isMobile ? "flex-start" : "flex-end",
      flexDirection: isMobile ? "column" : "row",
      gap: isMobile ? "14px" : "0",
      marginBottom: isMobile ? "20px" : styles.resultsHeader.marginBottom,
    },

    resultsTitle: {
      ...styles.resultsTitle,
      fontSize: isMobile ? "25px" : styles.resultsTitle.fontSize,
    },

    resultBadge: {
      ...styles.resultBadge,
      alignSelf: isMobile ? "flex-start" : "auto",
    },

    jobGrid: {
      ...styles.jobGrid,
      gridTemplateColumns: isMobile
        ? "minmax(0, 1fr)"
        : styles.jobGrid.gridTemplateColumns,
      gap: isMobile ? "15px" : styles.jobGrid.gap,
    },

    jobCard: {
      ...styles.jobCard,
      padding: isMobile ? "18px" : styles.jobCard.padding,
      minHeight: isMobile ? "auto" : styles.jobCard.minHeight,
      borderRadius: isMobile ? "16px" : styles.jobCard.borderRadius,
    },

    jobTitle: {
      ...styles.jobTitle,
      fontSize: isMobile ? "17px" : styles.jobTitle.fontSize,
    },

    cardFooter: {
      ...styles.cardFooter,
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "flex-start" : "center",
    },

    viewButton: {
      ...styles.viewButton,
      alignSelf: isMobile ? "flex-end" : "auto",
    },

    pagination: {
      ...styles.pagination,
      flexWrap: "wrap",
      gap: isMobile ? "12px" : styles.pagination.gap,
      marginTop: isMobile ? "30px" : styles.pagination.marginTop,
    },

    paginationButton: {
      ...styles.paginationButton,
      padding: isMobile ? "0 12px" : styles.paginationButton.padding,
    },

    messageBox: {
      ...styles.messageBox,
      padding: isMobile
        ? "45px 18px"
        : styles.messageBox.padding,
    },

    messageText: {
      ...styles.messageText,
      fontSize: isMobile ? "12px" : styles.messageText.fontSize,
    },
  };

  return (
    <main style={styles.page}>
      {/* Background Decorations */}
      <div style={styles.backgroundShapeOne}></div>
      <div style={styles.backgroundShapeTwo}></div>

      {/* ==================== HERO ==================== */}

      <section style={responsiveStyles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.eyebrow}>
            CAREERCONNECT JOBS
          </div>

          <h1 style={responsiveStyles.heading}>
            Find the right
            <br />
            <span style={styles.headingHighlight}>
              opportunity.
            </span>
          </h1>

          <p style={responsiveStyles.heroDescription}>
            Discover jobs from companies looking for
            talented people like you. Search, filter and
            find your next career opportunity.
          </p>

          <div style={responsiveStyles.heroStats}>
            <div style={responsiveStyles.heroStat}>
              <span style={styles.heroStatIcon}>
                💼
              </span>

              <div>
                <strong>Multiple</strong>
                <span>Job Opportunities</span>
              </div>
            </div>

            <div style={responsiveStyles.heroStatDivider}></div>

            <div style={responsiveStyles.heroStat}>
              <span style={styles.heroStatIcon}>
                🔎
              </span>

              <div>
                <strong>Smart Search</strong>
                <span>Find relevant jobs</span>
              </div>
            </div>

            <div style={responsiveStyles.heroStatDivider}></div>

            <div style={responsiveStyles.heroStat}>
              <span style={styles.heroStatIcon}>
                🚀
              </span>

              <div>
                <strong>Apply Easily</strong>
                <span>Start your journey</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SEARCH ==================== */}

      <section style={responsiveStyles.searchSection}>
        <form
          onSubmit={handleSearch}
          style={responsiveStyles.searchCard}
        >
          <div style={responsiveStyles.searchHeader}>
            <div>
              <h2 style={responsiveStyles.searchTitle}>
                Search Jobs
              </h2>

              <p style={responsiveStyles.searchSubtitle}>
                Find opportunities matching your
                preferences.
              </p>
            </div>

            <span style={styles.searchIcon}>
              🔎
            </span>
          </div>

          <div style={responsiveStyles.searchGrid}>
            {/* Job Search */}
            <div style={styles.searchField}>
              <label
                htmlFor="search"
                style={styles.label}
              >
                Job Title or Company
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>
                  🔎
                </span>

                <input
                  id="search"
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleChange}
                  placeholder="e.g. Software Engineer"
                  style={styles.input}
                />
              </div>
            </div>

            {/* Location */}
            <div style={styles.searchField}>
              <label
                htmlFor="location"
                style={styles.label}
              >
                Location
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>
                  📍
                </span>

                <input
                  id="location"
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleChange}
                  placeholder="Remote, Delhi..."
                  style={styles.input}
                />
              </div>
            </div>

            {/* Job Type */}
            <div style={styles.searchField}>
              <label
                htmlFor="jobType"
                style={styles.label}
              >
                Job Type
              </label>

              <select
                id="jobType"
                name="jobType"
                value={filters.jobType}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="">
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

            {/* Sort */}
            <div style={styles.searchField}>
              <label
                htmlFor="sort"
                style={styles.label}
              >
                Sort By
              </label>

              <select
                id="sort"
                name="sort"
                value={filters.sort}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="newest">
                  Newest
                </option>

                <option value="oldest">
                  Oldest
                </option>
              </select>
            </div>
          </div>

          <div style={responsiveStyles.searchActions}>
            <button
              type="submit"
              style={responsiveStyles.searchButton}
            >
              <span>🔎</span>
              Search Jobs
            </button>

            <button
              type="button"
              onClick={handleClear}
              style={responsiveStyles.clearButton}
            >
              Clear Filters
            </button>
          </div>
        </form>
      </section>

      {/* ==================== RESULTS ==================== */}

      <section style={responsiveStyles.resultsSection}>
        <div style={responsiveStyles.resultsHeader}>
          <div>
            <div style={styles.resultsEyebrow}>
              OPPORTUNITIES
            </div>

            <h2 style={responsiveStyles.resultsTitle}>
              Available Jobs
            </h2>

            {!loading && !error && (
              <p style={styles.resultsCount}>
                Showing{" "}
                <strong>
                  {pagination.totalJobs}
                </strong>{" "}
                {pagination.totalJobs === 1
                  ? "opportunity"
                  : "opportunities"}
              </p>
            )}
          </div>

          {!loading &&
            !error &&
            jobs.length > 0 && (
              <div style={responsiveStyles.resultBadge}>
                {pagination.totalJobs} Jobs
              </div>
            )}
        </div>

        {/* ==================== LOADING ==================== */}

        {loading ? (
          <div style={responsiveStyles.messageBox}>
            <div style={styles.spinner}></div>

            <h3 style={styles.messageTitle}>
              Loading jobs...
            </h3>

            <p style={responsiveStyles.messageText}>
              Finding the latest opportunities for
              you.
            </p>
          </div>
        ) : error ? (
          /* ==================== ERROR ==================== */

          <div style={responsiveStyles.messageBox}>
            <div style={styles.messageIcon}>
              ⚠️
            </div>

            <h3 style={styles.messageTitle}>
              Something went wrong
            </h3>

            <p style={responsiveStyles.messageText}>
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                fetchJobs(filters, currentPage)
              }
              style={styles.primaryMessageButton}
            >
              Try Again
            </button>
          </div>
        ) : jobs.length === 0 ? (
          /* ==================== EMPTY ==================== */

          <div style={responsiveStyles.messageBox}>
            <div style={styles.emptyIcon}>
              🔎
            </div>

            <h3 style={styles.messageTitle}>
              No jobs found
            </h3>

            <p style={responsiveStyles.messageText}>
              We couldn't find any jobs matching
              your current search and filters.
            </p>

            <button
              type="button"
              onClick={handleClear}
              style={styles.primaryMessageButton}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* ==================== JOB GRID ==================== */}

            <div style={responsiveStyles.jobGrid}>
              {jobs.map((job) => {
                const jobTypeStyle =
                  getJobTypeStyle(job.jobType);

                return (
                  <article
                    key={job._id}
                    style={responsiveStyles.jobCard}
                  >
                    <div style={styles.cardHeader}>
                      <div style={styles.companyIcon}>
                        {getCompanyInitial(job.company)}
                      </div>

                      <span
                        style={{
                          ...styles.jobTypeBadge,
                          background:
                            jobTypeStyle.background,
                          color:
                            jobTypeStyle.color,
                        }}
                      >
                        {job.jobType}
                      </span>
                    </div>

                    <h3 style={responsiveStyles.jobTitle}>
                      {job.title}
                    </h3>

                    <p style={styles.companyName}>
                      {job.company}
                    </p>

                    <div style={styles.metaContainer}>
                      <div style={styles.metaItem}>
                        <span style={styles.metaIcon}>
                          📍
                        </span>

                        <span>{job.location}</span>
                      </div>

                      <div style={styles.metaItem}>
                        <span style={styles.metaIcon}>
                          💰
                        </span>

                        <span>{job.salary}</span>
                      </div>
                    </div>

                    <p style={styles.jobDescription}>
                      {job.description}
                    </p>

                    {job.requirements?.length > 0 && (
                      <div style={styles.skills}>
                        {job.requirements
                          .slice(0, 3)
                          .map((requirement, index) => (
                            <span
                              key={index}
                              style={styles.skill}
                            >
                              {requirement}
                            </span>
                          ))}

                        {job.requirements.length > 3 && (
                          <span
                            style={styles.moreSkills}
                          >
                            +
                            {job.requirements.length -
                              3}
                          </span>
                        )}
                      </div>
                    )}

                    <div
                      style={responsiveStyles.cardFooter}
                    >
                      <div style={styles.postedInfo}>
                        <span
                          style={styles.postedDot}
                        ></span>
                        Recently posted
                      </div>

                      <Link
                        to={`/jobs/${job._id}`}
                        style={responsiveStyles.viewButton}
                      >
                        View Details
                        <span style={styles.arrow}>
                          →
                        </span>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* ==================== PAGINATION ==================== */}

            {pagination.totalPages > 1 && (
              <div style={responsiveStyles.pagination}>
                <button
                  type="button"
                  disabled={
                    !pagination.hasPreviousPage
                  }
                  onClick={() =>
                    handlePageChange(
                      currentPage - 1
                    )
                  }
                  style={{
                    ...responsiveStyles.paginationButton,
                    ...(!pagination.hasPreviousPage
                      ? styles.paginationDisabled
                      : {}),
                  }}
                >
                  ← Previous
                </button>

                <div style={styles.pageIndicator}>
                  <span>Page</span>

                  <strong>{currentPage}</strong>

                  <span>of</span>

                  <strong>
                    {pagination.totalPages}
                  </strong>
                </div>

                <button
                  type="button"
                  disabled={
                    !pagination.hasNextPage
                  }
                  onClick={() =>
                    handlePageChange(
                      currentPage + 1
                    )
                  }
                  style={{
                    ...responsiveStyles.paginationButton,
                    ...(!pagination.hasNextPage
                      ? styles.paginationDisabled
                      : {}),
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

// ==================== STYLES ====================

const styles = {
  page: {
    minHeight: "calc(100vh - 70px)",
    background:
      "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f8fafc 100%)",
    position: "relative",
    overflow: "hidden",
    paddingBottom: "80px",
    boxSizing: "border-box",
  },

  backgroundShapeOne: {
    position: "absolute",
    width: "520px",
    height: "520px",
    borderRadius: "50%",
    background: "rgba(79, 70, 229, 0.06)",
    top: "-270px",
    left: "-220px",
    pointerEvents: "none",
  },

  backgroundShapeTwo: {
    position: "absolute",
    width: "430px",
    height: "430px",
    borderRadius: "50%",
    background: "rgba(37, 99, 235, 0.05)",
    top: "620px",
    right: "-240px",
    pointerEvents: "none",
  },

  hero: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "65px 24px 38px",
    position: "relative",
    zIndex: 1,
    boxSizing: "border-box",
  },

  heroContent: {
    maxWidth: "850px",
  },

  eyebrow: {
    display: "inline-block",
    marginBottom: "14px",
    color: "#4f46e5",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.7px",
  },

  heading: {
    margin: 0,
    color: "#0f172a",
    fontSize: "48px",
    lineHeight: "1.1",
    letterSpacing: "-2px",
    fontWeight: "800",
  },

  headingHighlight: {
    color: "#4f46e5",
  },

  heroDescription: {
    maxWidth: "650px",
    margin: "18px 0 0",
    color: "#64748b",
    fontSize: "16px",
    lineHeight: "1.7",
  },

  heroStats: {
    marginTop: "28px",
    display: "flex",
    alignItems: "center",
    gap: "22px",
  },

  heroStat: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
  },

  heroStatIcon: {
    width: "34px",
    height: "34px",
    flexShrink: 0,
    borderRadius: "9px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
  },

  heroStatDivider: {
    width: "1px",
    height: "32px",
    background: "#dbe3ef",
  },

  searchSection: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "0 24px",
    position: "relative",
    zIndex: 2,
    boxSizing: "border-box",
  },

  searchCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "25px",
    boxShadow:
      "0 18px 45px rgba(15, 23, 42, 0.08)",
    boxSizing: "border-box",
  },

  searchHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "22px",
  },

  searchTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "19px",
    fontWeight: "800",
  },

  searchSubtitle: {
    margin: "5px 0 0",
    color: "#94a3b8",
    fontSize: "12px",
  },

  searchIcon: {
    width: "42px",
    height: "42px",
    flexShrink: 0,
    borderRadius: "12px",
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "17px",
  },

  searchGrid: {
    display: "grid",
    gridTemplateColumns:
      "1.5fr 1.1fr 1fr 1fr",
    gap: "14px",
  },

  searchField: {
    minWidth: 0,
    width: "100%",
    boxSizing: "border-box",
  },

  label: {
    display: "block",
    marginBottom: "7px",
    color: "#334155",
    fontSize: "12px",
    fontWeight: "700",
  },

  inputWrapper: {
    minHeight: "46px",
    display: "flex",
    alignItems: "center",
    border: "1px solid #dbe3ef",
    borderRadius: "10px",
    background: "#ffffff",
    width: "100%",
    boxSizing: "border-box",
    overflow: "hidden",
  },

  inputIcon: {
    width: "38px",
    flexShrink: 0,
    textAlign: "center",
    fontSize: "13px",
    opacity: 0.65,
  },

  input: {
    width: "100%",
    minWidth: 0,
    border: "none",
    outline: "none",
    background: "transparent",
    padding: "12px 10px 12px 0",
    color: "#1e293b",
    fontSize: "13px",
    boxSizing: "border-box",
  },

  select: {
    width: "100%",
    minWidth: 0,
    minHeight: "46px",
    border: "1px solid #dbe3ef",
    borderRadius: "10px",
    background: "#ffffff",
    padding: "0 11px",
    outline: "none",
    color: "#334155",
    fontSize: "13px",
    cursor: "pointer",
    boxSizing: "border-box",
  },

  searchActions: {
    marginTop: "18px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "9px",
  },

  searchButton: {
    minHeight: "43px",
    border: "none",
    borderRadius: "10px",
    padding: "0 18px",
    background:
      "linear-gradient(135deg, #4f46e5, #2563eb)",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },

  clearButton: {
    minHeight: "43px",
    border: "1px solid #dbe3ef",
    borderRadius: "10px",
    padding: "0 16px",
    background: "#ffffff",
    color: "#475569",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },

  resultsSection: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "62px 24px 0",
    position: "relative",
    zIndex: 1,
    boxSizing: "border-box",
  },

  resultsHeader: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: "27px",
  },

  resultsEyebrow: {
    color: "#4f46e5",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.5px",
    marginBottom: "7px",
  },

  resultsTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "29px",
    letterSpacing: "-0.8px",
    fontWeight: "800",
  },

  resultsCount: {
    margin: "7px 0 0",
    color: "#94a3b8",
    fontSize: "12px",
  },

  resultBadge: {
    padding: "8px 12px",
    borderRadius: "9px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    color: "#475569",
    fontSize: "11px",
    fontWeight: "700",
  },

  jobGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "20px",
  },

  jobCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "23px",
    boxShadow:
      "0 10px 30px rgba(15, 23, 42, 0.05)",
    display: "flex",
    flexDirection: "column",
    minHeight: "375px",
    minWidth: 0,
    boxSizing: "border-box",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    marginBottom: "20px",
  },

  companyIcon: {
    width: "47px",
    height: "47px",
    flexShrink: 0,
    borderRadius: "13px",
    background:
      "linear-gradient(135deg, #eef2ff, #e0e7ff)",
    color: "#4f46e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    fontWeight: "800",
  },

  jobTypeBadge: {
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "10px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  jobTitle: {
    margin: "0 0 6px",
    color: "#0f172a",
    fontSize: "18px",
    lineHeight: "1.35",
    fontWeight: "800",
    overflowWrap: "anywhere",
  },

  companyName: {
    margin: "0 0 17px",
    color: "#4f46e5",
    fontSize: "13px",
    fontWeight: "700",
    overflowWrap: "anywhere",
  },

  metaContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    paddingBottom: "16px",
    borderBottom: "1px solid #f1f5f9",
  },

  metaItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "6px",
    color: "#64748b",
    fontSize: "11px",
    minWidth: 0,
    overflowWrap: "anywhere",
  },

  metaIcon: {
    fontSize: "12px",
    flexShrink: 0,
  },

  jobDescription: {
    margin: "15px 0",
    color: "#64748b",
    fontSize: "12px",
    lineHeight: "1.65",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },

  skills: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginBottom: "18px",
  },

  skill: {
    padding: "5px 8px",
    borderRadius: "6px",
    background: "#f5f3ff",
    color: "#5b21b6",
    fontSize: "10px",
    fontWeight: "600",
    overflowWrap: "anywhere",
  },

  moreSkills: {
    padding: "5px 8px",
    borderRadius: "6px",
    background: "#f1f5f9",
    color: "#64748b",
    fontSize: "10px",
    fontWeight: "700",
  },

  cardFooter: {
    marginTop: "auto",
    paddingTop: "15px",
    borderTop: "1px solid #f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
  },

  postedInfo: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#94a3b8",
    fontSize: "10px",
  },

  postedDot: {
    width: "6px",
    height: "6px",
    flexShrink: 0,
    borderRadius: "50%",
    background: "#22c55e",
  },

  viewButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    color: "#4f46e5",
    textDecoration: "none",
    fontSize: "11px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  arrow: {
    fontSize: "15px",
  },

  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "25px",
    marginTop: "45px",
  },

  paginationButton: {
    minHeight: "40px",
    border: "1px solid #dbe3ef",
    borderRadius: "10px",
    padding: "0 15px",
    background: "#ffffff",
    color: "#334155",
    fontSize: "11px",
    fontWeight: "700",
    cursor: "pointer",
  },

  paginationDisabled: {
    opacity: 0.45,
    cursor: "not-allowed",
  },

  pageIndicator: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#64748b",
    fontSize: "12px",
  },

  messageBox: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "65px 25px",
    textAlign: "center",
    boxShadow:
      "0 10px 30px rgba(15, 23, 42, 0.04)",
    boxSizing: "border-box",
  },

  messageIcon: {
    fontSize: "35px",
    marginBottom: "13px",
  },

  emptyIcon: {
    width: "58px",
    height: "58px",
    borderRadius: "16px",
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px",
    fontSize: "25px",
  },

  messageTitle: {
    margin: "0 0 8px",
    color: "#1e293b",
    fontSize: "18px",
    fontWeight: "800",
  },

  messageText: {
    maxWidth: "500px",
    margin: "0 auto 20px",
    color: "#64748b",
    fontSize: "13px",
    lineHeight: "1.6",
  },

  primaryMessageButton: {
    minHeight: "42px",
    border: "none",
    borderRadius: "10px",
    padding: "0 18px",
    background:
      "linear-gradient(135deg, #4f46e5, #2563eb)",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },

  spinner: {
    width: "30px",
    height: "30px",
    border: "3px solid #e0e7ff",
    borderTopColor: "#4f46e5",
    borderRadius: "50%",
    margin: "0 auto 17px",
  },
};

export default Jobs;