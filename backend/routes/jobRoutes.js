const express = require("express");

const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
} = require("../controllers/jobController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create a job - protected route
router.post("/", protect, createJob);

// Get all jobs - public route
router.get("/", getAllJobs);

// Get jobs posted by the logged-in employer
router.get("/my-jobs", protect, getMyJobs);

// Get a single job - public route
router.get("/:id", getJobById);

// Update a job - protected route
router.patch("/:id", protect, updateJob);

// Delete a job - protected route
router.delete("/:id", protect, deleteJob);

module.exports = router;