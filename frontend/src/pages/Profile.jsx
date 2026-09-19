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

  if (loading) {
    return (
      <main className="profile-page">
        <div className="profile-container">
          <div className="profile-message">
            <div className="loading-spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-container">
        <div className="profile-heading">
          <span className="section-label">ACCOUNT</span>

          <h1>My Profile</h1>

          <p>
            Manage your CareerConnect account information.
          </p>
        </div>

        <section className="profile-card">
          <div className="profile-card-header">
            <div className="profile-avatar">
              {formData.name
                ? formData.name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div className="profile-user-info">
              <h2>{formData.name || "User"}</h2>
              <p>{formData.email}</p>
            </div>

            <span className={`profile-role ${user?.role}`}>
              {user?.role === "employer"
                ? "Employer"
                : "Job Seeker"}
            </span>
          </div>

          <div className="profile-divider"></div>

          <form
            onSubmit={handleSubmit}
            className="profile-form"
          >
            <div className="profile-section-title">
              <h3>Personal Information</h3>

              <p>
                Update the information associated with your
                account.
              </p>
            </div>

            {error && (
              <div className="profile-error">
                {error}
              </div>
            )}

            {success && (
              <div className="profile-success">
                {success}
              </div>
            )}

            <div className="profile-form-grid">
              <div className="profile-form-group">
                <label htmlFor="name">
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled
                />

                <small>
                  Email address cannot be changed from the
                  profile page.
                </small>
              </div>
            </div>

            <div className="profile-account-info">
              <div>
                <span>ACCOUNT TYPE</span>

                <strong>
                  {user?.role === "employer"
                    ? "Employer Account"
                    : "Job Seeker Account"}
                </strong>
              </div>

              <div>
                <span>ACCOUNT STATUS</span>

                <strong className="profile-active">
                  Active
                </strong>
              </div>
            </div>

            <div className="profile-actions">
              <button
                type="submit"
                className="profile-save-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Profile;