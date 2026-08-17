const express = require("express");
const router = express.Router();

const {
  login,
  register,
  getMe,
} = require("../controllers/authController");

const { authenticateToken } = require("../middleware/auth");

// =====================
// LOGIN
// =====================
router.post("/login", login);

// =====================
// REGISTER
// =====================
router.post("/register", register);

// =====================
// GET CURRENT USER
// =====================
router.get("/me", authenticateToken, getMe);

module.exports = router;