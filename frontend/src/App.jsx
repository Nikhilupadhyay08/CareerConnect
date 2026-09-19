import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";

import JobSeekerDashboard from "./pages/JobSeekerDashboard";

import EmployerDashboard from "./pages/EmployerDashboard";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";
import Applicants from "./pages/Applicants";

import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Jobs */}
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />

        {/* Job Seeker Dashboard */}
        <Route
          path="/jobseeker/dashboard"
          element={
            <ProtectedRoute allowedRole="jobseeker">
              <JobSeekerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Employer Dashboard */}
        <Route
          path="/employer/dashboard"
          element={
            <ProtectedRoute allowedRole="employer">
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Create Job */}
        <Route
          path="/employer/create-job"
          element={
            <ProtectedRoute allowedRole="employer">
              <CreateJob />
            </ProtectedRoute>
          }
        />

        {/* Edit Job */}
        <Route
          path="/employer/edit-job/:id"
          element={
            <ProtectedRoute allowedRole="employer">
              <EditJob />
            </ProtectedRoute>
          }
        />

        {/* Applicants */}
        <Route
          path="/employer/job/:jobId/applicants"
          element={
            <ProtectedRoute allowedRole="employer">
              <Applicants />
            </ProtectedRoute>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;