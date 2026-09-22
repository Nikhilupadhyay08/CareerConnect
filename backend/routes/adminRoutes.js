const express = require("express");

const {
  getAllUsers,
  getAllJobs,
  getAllApplications,
  getStats,
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, adminMiddleware);

// Get all users
router.get("/users", getAllUsers);

// Get all jobs
router.get("/jobs", getAllJobs);

// Get all applications
router.get("/applications", getAllApplications);

// Get platform statistics
router.get("/stats", getStats);

module.exports = router;