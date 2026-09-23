const express = require("express");

const {
  saveJob,
  removeSavedJob,
  getSavedJobs,
  checkSavedJob,
} = require("../controllers/savedJobController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Save a job
router.post("/:jobId", protect, saveJob);

// Remove a saved job
router.delete("/:jobId", protect, removeSavedJob);

// Get all saved jobs
router.get("/", protect, getSavedJobs);

// Check if a specific job is saved
router.get("/:jobId", protect, checkSavedJob);

module.exports = router;