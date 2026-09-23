const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");

// ==========================================
// Get all users
// ==========================================

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Fetch users error:", error);

    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};

// ==========================================
// Get all jobs
// ==========================================

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("employer", "name email")
      .sort({ createdAt: -1 });

    res.json({
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Fetch jobs error:", error);

    res.status(500).json({
      message: "Failed to fetch jobs",
    });
  }
};

// ==========================================
// Get all applications
// ==========================================

const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("applicant", "name email")
      .populate({
        path: "job",
        select: "title company location jobType employer",
        populate: {
          path: "employer",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 });

    res.json({
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Fetch applications error:", error);

    res.status(500).json({
      message: "Failed to fetch applications",
    });
  }
};

// ==========================================
// Get platform statistics
// ==========================================

const getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalJobseekers,
      totalEmployers,
      totalAdmins,
      totalJobs,
      totalApplications,
      appliedApplications,
      shortlistedApplications,
      rejectedApplications,
      hiredApplications,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "jobseeker" }),
      User.countDocuments({ role: "employer" }),
      User.countDocuments({ role: "admin" }),

      Job.countDocuments(),

      Application.countDocuments(),
      Application.countDocuments({ status: "Applied" }),
      Application.countDocuments({ status: "Shortlisted" }),
      Application.countDocuments({ status: "Rejected" }),
      Application.countDocuments({ status: "Hired" }),
    ]);

    res.json({
      users: {
        total: totalUsers,
        jobseekers: totalJobseekers,
        employers: totalEmployers,
        admins: totalAdmins,
      },

      jobs: {
        total: totalJobs,
      },

      applications: {
        total: totalApplications,
        applied: appliedApplications,
        shortlisted: shortlistedApplications,
        rejected: rejectedApplications,
        hired: hiredApplications,
      },
    });
  } catch (error) {
    console.error("Fetch statistics error:", error);

    res.status(500).json({
      message: "Failed to fetch statistics",
    });
  }
};

module.exports = {
  getAllUsers,
  getAllJobs,
  getAllApplications,
  getStats,
};