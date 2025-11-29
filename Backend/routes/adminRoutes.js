// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const authAdmin = require("../middleware/authAdmin");

// Models
const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");

// ==================== USERS ====================
// GET all users
router.get("/users", authAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET user by ID
router.get("/users/:id", authAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE user
router.put("/users/:id", authAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE user
router.delete("/users/:id", authAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== PRODUCTS ====================
// GET all products
router.get("/products", authAdmin, async (req, res) => {
  try {
    const products = await Product.find().populate("categoryId");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE product
router.post("/products", authAdmin, async (req, res) => {
  try {
    const { name, description, price, stock, categoryId, imageUrl } = req.body;
    const product = new Product({ name, description, price, stock, categoryId, imageUrl });
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE product
router.put("/products/:id", authAdmin, async (req, res) => {
  try {
    const { name, description, price, stock, categoryId, imageUrl } = req.body;
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, stock, categoryId, imageUrl },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE product
router.delete("/products/:id", authAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== CATEGORIES ====================
// GET all categories
router.get("/categories", authAdmin, async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE category
router.post("/categories", authAdmin, async (req, res) => {
  try {
    const category = new Category({ name: req.body.name });
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE category
router.put("/categories/:id", authAdmin, async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Category not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE category
router.delete("/categories/:id", authAdmin, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
