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

      console.log("EDIT JOB RESPONSE:", job);

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
      <main className="job-form-page">
        <div className="job-form-container">
          <div className="job-form-loading">
            Loading job details...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="job-form-page">
      <div className="job-form-container">
        <div className="job-form-heading">
          <span className="section-label">EMPLOYER</span>

          <h1>Edit Job</h1>

          <p>
            Update your job posting and keep the information
            accurate for candidates.
          </p>
        </div>

        <form className="job-form-card" onSubmit={handleSubmit}>
          <div className="job-form-section">
            <h2>Job Information</h2>

            <p className="job-form-section-description">
              Update the basic details about the position.
            </p>

            <div className="job-form-grid">
              <div className="form-group">
                <label htmlFor="title">
                  Job Title <span>*</span>
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Full Stack Developer"
                />
              </div>

              <div className="form-group">
                <label htmlFor="company">
                  Company <span>*</span>
                </label>

                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. CareerConnect"
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">
                  Location <span>*</span>
                </label>

                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Remote, Delhi"
                />
              </div>

              <div className="form-group">
                <label htmlFor="salary">
                  Salary <span>*</span>
                </label>

                <input
                  id="salary"
                  name="salary"
                  type="text"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g. 5-8 LPA"
                />
              </div>

              <div className="form-group">
                <label htmlFor="jobType">
                  Job Type <span>*</span>
                </label>

                <select
                  id="jobType"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            </div>
          </div>

          <div className="job-form-divider"></div>

          <div className="job-form-section">
            <h2>Job Description</h2>

            <p className="job-form-section-description">
              Update the role, responsibilities and expectations.
            </p>

            <div className="form-group">
              <label htmlFor="description">
                Description <span>*</span>
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the job, responsibilities and expectations..."
                rows="7"
              />
            </div>
          </div>

          <div className="job-form-divider"></div>

          <div className="job-form-section">
            <h2>Requirements</h2>

            <p className="job-form-section-description">
              Add one requirement per line.
            </p>

            <div className="form-group">
              <label htmlFor="requirements">
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
                rows="7"
              />

              <small>
                Enter each skill or qualification on a
                separate line.
              </small>
            </div>
          </div>

          {error && (
            <div className="job-form-error">
              {error}
            </div>
          )}

          <div className="job-form-actions">
            <button
              type="button"
              className="job-form-cancel"
              onClick={() => navigate("/employer/dashboard")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button job-form-submit"
              disabled={saving}
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default EditJob;