const express = require("express");
const { body } = require("express-validator");

const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
} = require("../controllers/jobController");

const protect = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validationMiddleware");

const router = express.Router();

// ==========================================
// Validation rules for creating a job
// ==========================================

const jobValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Job title is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Job title must be between 2 and 100 characters"),

  body("company")
    .trim()
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Company name must be between 2 and 100 characters"),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Location must be between 2 and 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Job description is required")
    .isLength({ min: 20, max: 5000 })
    .withMessage(
      "Job description must be between 20 and 5000 characters"
    ),

  body("jobType")
    .optional()
    .isIn([
      "Full-time",
      "Part-time",
      "Internship",
      "Contract",
    ])
    .withMessage("Invalid job type"),

  body("salary")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Salary must not exceed 100 characters"),

  body("requirements")
    .optional()
    .isArray()
    .withMessage("Requirements must be an array"),

  body("requirements.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage(
      "Each requirement must be between 1 and 100 characters"
    ),
];

// ==========================================
// Validation rules for updating a job
// ==========================================

const jobUpdateValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Job title must be between 2 and 100 characters"),

  body("company")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Company name must be between 2 and 100 characters"),

  body("location")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Location must be between 2 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 20, max: 5000 })
    .withMessage(
      "Job description must be between 20 and 5000 characters"
    ),

  body("jobType")
    .optional()
    .isIn([
      "Full-time",
      "Part-time",
      "Internship",
      "Contract",
    ])
    .withMessage("Invalid job type"),

  body("salary")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Salary must not exceed 100 characters"),

  body("requirements")
    .optional()
    .isArray()
    .withMessage("Requirements must be an array"),

  body("requirements.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage(
      "Each requirement must be between 1 and 100 characters"
    ),
];

// ==========================================
// Create a job - protected route
// ==========================================

router.post(
  "/",
  protect,
  jobValidation,
  validateRequest,
  createJob
);

// ==========================================
// Get all jobs - public route
// ==========================================

router.get("/", getAllJobs);

// ==========================================
// Get jobs posted by logged-in employer
// ==========================================

router.get("/my-jobs", protect, getMyJobs);

// ==========================================
// Get a single job - public route
// ==========================================

router.get("/:id", getJobById);

// ==========================================
// Update a job - protected route
// ==========================================

router.patch(
  "/:id",
  protect,
  jobUpdateValidation,
  validateRequest,
  updateJob
);

// ==========================================
// Delete a job - protected route
// ==========================================

router.delete("/:id", protect, deleteJob);

module.exports = router;