import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";

// Job Seeker
import JobSeekerDashboard from "./pages/JobSeekerDashboard";

// Employer
import EmployerDashboard from "./pages/EmployerDashboard";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";
import Applicants from "./pages/Applicants";

// Admin
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminUserDetails from "./pages/AdminUserDetails";
import AdminJobs from "./pages/AdminJobs";
import AdminJobDetails from "./pages/AdminJobDetails";
import AdminApplications from "./pages/AdminApplications";
import AdminApplicationDetails from "./pages/AdminApplicationDetails";

// Profile
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <div style={styles.app}>
        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <main style={styles.main}>
          <Routes>
            {/* ==================== PUBLIC ==================== */}

            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route path="/jobs" element={<Jobs />} />

            <Route
              path="/jobs/:id"
              element={<JobDetails />}
            />

            {/* ==================== JOB SEEKER ==================== */}

            <Route
              path="/jobseeker/dashboard"
              element={
                <ProtectedRoute allowedRole="jobseeker">
                  <JobSeekerDashboard />
                </ProtectedRoute>
              }
            />

            {/* ==================== EMPLOYER ==================== */}

            <Route
              path="/employer/dashboard"
              element={
                <ProtectedRoute allowedRole="employer">
                  <EmployerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/employer/create-job"
              element={
                <ProtectedRoute allowedRole="employer">
                  <CreateJob />
                </ProtectedRoute>
              }
            />

            <Route
              path="/employer/edit-job/:id"
              element={
                <ProtectedRoute allowedRole="employer">
                  <EditJob />
                </ProtectedRoute>
              }
            />

            <Route
              path="/employer/job/:jobId/applicants"
              element={
                <ProtectedRoute allowedRole="employer">
                  <Applicants />
                </ProtectedRoute>
              }
            />

            {/* ==================== ADMIN ==================== */}

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminUsers />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users/:id"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminUserDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/jobs"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminJobs />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/jobs/:id"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminJobDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/applications"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminApplications />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/applications/:id"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminApplicationDetails />
                </ProtectedRoute>
              }
            />

            {/* ==================== PROFILE ==================== */}

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* ==================== 404 ==================== */}

            <Route
              path="*"
              element={
                <div style={styles.notFound}>
                  <h1 style={styles.notFoundTitle}>404</h1>

                  <p style={styles.notFoundText}>
                    Page not found.
                  </p>
                </div>
              }
            />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#f8fafc",
  },

  main: {
    flex: 1,
    width: "100%",
  },

  notFound: {
    minHeight: "60vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "40px 20px",
  },

  notFoundTitle: {
    margin: 0,
    fontSize: "72px",
    fontWeight: "800",
    color: "#0f172a",
    lineHeight: 1,
  },

  notFoundText: {
    marginTop: "14px",
    marginBottom: 0,
    fontSize: "16px",
    color: "#64748b",
  },
};

export default App;