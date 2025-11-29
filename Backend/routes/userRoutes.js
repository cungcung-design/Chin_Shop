const express = require("express");
const router = express.Router();
const User = require("../models/User"); 

// ===================== GET all users =====================
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ===================== GET user by ID =====================
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Get user by ID error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ===================== CREATE new user =====================
router.post("/", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Optional: check for existing email
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const newUser = new User({ name, email, password, role: role || "user" });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ===================== UPDATE user =====================
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ===================== DELETE user =====================
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
