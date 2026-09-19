const express = require("express");

const {
  registerUser,
  loginUser,
  getMyProfile,
  updateMyProfile,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Get logged-in user's profile
router.get("/profile", protect, getMyProfile);

// Update logged-in user's profile
router.patch("/profile", protect, updateMyProfile);

module.exports = router;