const express = require("express");

const {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  viewResume,
  downloadResume,
} = require("../controllers/applicationController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Job seeker applies for a job
router.post("/", protect, upload.single("resume"), applyForJob);

// Job seeker views their applications
router.get("/my-applications", protect, getMyApplications);

// Employer views applicants for a job
router.get("/job/:jobId", protect, getJobApplicants);

// Employer updates application status
router.patch(
  "/:applicationId/status",
  protect,
  updateApplicationStatus
);

// Employer views resume
router.get(
  "/:applicationId/resume/view",
  protect,
  viewResume
);

// Employer downloads resume
router.get(
  "/:applicationId/resume/download",
  protect,
  downloadResume
);

module.exports = router;