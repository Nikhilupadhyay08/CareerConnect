const express = require("express");
const { body } = require("express-validator");

const {
  registerUser,
  loginUser,
  getMyProfile,
  updateMyProfile,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validationMiddleware");

const router = express.Router();

// Register
router.post(
  "/register",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),

    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please provide a valid email address")
      .normalizeEmail(),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6, max: 100 })
      .withMessage("Password must be between 6 and 100 characters"),

    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .isIn(["jobseeker", "employer"])
      .withMessage("Role must be either jobseeker or employer"),
  ],
  validateRequest,
  registerUser
);

// Login
router.post(
  "/login",
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please provide a valid email address")
      .normalizeEmail(),

    body("password")
      .notEmpty()
      .withMessage("Password is required"),
  ],
  validateRequest,
  loginUser
);

// Get profile
router.get(
  "/profile",
  protect,
  getMyProfile
);

// Update profile
router.patch(
  "/profile",
  protect,
  updateMyProfile
);

module.exports = router;