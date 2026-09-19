import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllJobs } from "../services/api";

function Jobs() {
  const [jobs, setJobs] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    location: "",
    jobType: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch jobs
  const fetchJobs = async (currentFilters = filters) => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllJobs(currentFilters);

      setJobs(data.jobs);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load all jobs when page opens
  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle filter input changes
  const handleChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
  };

  // Search jobs
  const handleSearch = (event) => {
    event.preventDefault();

    fetchJobs(filters);
  };

  // Clear all filters
  const handleClear = () => {
    const emptyFilters = {
      search: "",
      location: "",
      jobType: "",
    };

    setFilters(emptyFilters);

    fetchJobs(emptyFilters);
  };

  return (
    <main className="jobs-page">
      {/* Page Header */}
      <section className="jobs-header">
        <div>
          <span className="section-label">
            CAREERCONNECT JOBS
          </span>

          <h1>Find your next opportunity</h1>

          <p>
            Explore jobs from companies looking for talented people
            like you.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="jobs-search-section">
        <form
          className="jobs-search-form"
          onSubmit={handleSearch}
        >
          {/* Search */}
          <div className="search-field search-main">
            <label htmlFor="search">Search</label>

            <input
              id="search"
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Job title or company"
            />
          </div>

          {/* Location */}
          <div className="search-field">
            <label htmlFor="location">Location</label>

            <input
              id="location"
              type="text"
              name="location"
              value={filters.location}
              onChange={handleChange}
              placeholder="e.g. Remote, Delhi"
            />
          </div>

          {/* Job Type */}
          <div className="search-field">
            <label htmlFor="jobType">Job Type</label>

            <select
              id="jobType"
              name="jobType"
              value={filters.jobType}
              onChange={handleChange}
            >
              <option value="">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="search-actions">
            <button
              type="submit"
              className="primary-button"
            >
              Search Jobs
            </button>

            <button
              type="button"
              className="clear-button"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </form>
      </section>

      {/* Job Results */}
      <section className="jobs-results">
        <div className="jobs-results-header">
          <div>
            <h2>Available Jobs</h2>

            {!loading && !error && (
              <p>
                {jobs.length}{" "}
                {jobs.length === 1 ? "job" : "jobs"} found
              </p>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="jobs-message">
            <div className="loading-spinner"></div>

            <p>Loading jobs...</p>
          </div>
        ) : error ? (
          /* Error */
          <div className="jobs-message error-message">
            <h3>Something went wrong</h3>

            <p>{error}</p>

            <button
              onClick={() => fetchJobs()}
              className="primary-button"
            >
              Try Again
            </button>
          </div>
        ) : jobs.length === 0 ? (
          /* No Jobs */
          <div className="jobs-message">
            <div className="empty-icon">🔎</div>

            <h3>No jobs found</h3>

            <p>
              Try changing your search or filter criteria.
            </p>
          </div>
        ) : (
          /* Job Cards */
          <div className="job-grid">
            {jobs.map((job) => (
              <article
                className="job-card"
                key={job._id}
              >
                {/* Card Top */}
                <div className="job-card-top">
                  <div className="company-icon">
                    {job.company
                      ? job.company.charAt(0).toUpperCase()
                      : "C"}
                  </div>

                  <span className="job-type-badge">
                    {job.jobType}
                  </span>
                </div>

                {/* Job Title */}
                <h3>{job.title}</h3>

                {/* Company */}
                <p className="job-company">
                  {job.company}
                </p>

                {/* Job Meta */}
                <div className="job-meta">
                  <span>
                    📍 {job.location}
                  </span>

                  <span>
                    💰 {job.salary}
                  </span>
                </div>

                {/* Description */}
                <p className="job-description">
                  {job.description}
                </p>

                {/* Requirements */}
                {job.requirements &&
                  job.requirements.length > 0 && (
                    <div className="job-skills">
                      {job.requirements
                        .slice(0, 3)
                        .map((requirement, index) => (
                          <span key={index}>
                            {requirement}
                          </span>
                        ))}
                    </div>
                  )}

                {/* Card Footer */}
                <div className="job-card-footer">
                  <span className="job-posted">
                    Posted recently
                  </span>

                  <Link
                    to={`/jobs/${job._id}`}
                    className="view-job-button"
                  >
                    View Details →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Jobs;