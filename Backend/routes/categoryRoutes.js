const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// GET all categories
router.get("/", async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

// POST create category
router.post("/", async (req, res) => {
  const { name, description, image } = req.body;
  const newCategory = new Category({ name, description, image });
  await newCategory.save();
  res.json(newCategory);
});

// UPDATE category
router.put("/:id", async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, description: req.body.description, image: req.body.image },
      { new: true }
    );
    if (!updatedCategory) return res.status(404).json({ message: "Category not found" });
    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE category
router.delete("/:id", async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
