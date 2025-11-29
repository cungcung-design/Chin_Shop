const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("categoryId")
      .populate("comments.user");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE product
router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      categoryId,
      imageUrl,
      colors,
      sizes,
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      stock,
      categoryId,
      imageUrl,
      colors, // <-- new: array of { color, image }
      sizes,
    });

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("categoryId")
      .populate("comments.user");
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE product
router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      categoryId,
      imageUrl,
      colors,
      sizes,
    } = req.body;

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, stock, categoryId, imageUrl, colors, sizes }, // <-- include colors and sizes
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rate product
router.post("/:id/rate", async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, userId } = req.body;

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Add rating
    product.ratings = product.ratings || [];
    product.ratings.push(rating);

    // Add comment with user reference
    if (comment && comment.trim() !== "") {
      product.comments = product.comments || [];
      product.comments.push({ user: userId, rating, comment });
    }

    // Update average rating
    const sum = product.ratings.reduce((a, b) => a + b, 0);
    product.averageRating = sum / product.ratings.length;

    await product.save();

    // Return populated product
    const populatedProduct = await Product.findById(id)
      .populate("categoryId")
      .populate("comments.user");

    res.json(populatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// DELETE a comment
router.delete("/:productId/comments/:commentId", async (req, res) => {
  try {
    const { productId, commentId } = req.params;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Filter out the comment to delete
    product.comments = (product.comments || []).filter(
      (c) => c._id.toString() !== commentId
    );

    await product.save();
    res.json(product.comments); // return updated comments
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CLEAR ratings and comments for a product (without deleting the product)
router.delete("/:id/ratings-comments", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Clearing ratings for product ID:", id);

    const product = await Product.findById(id);
    if (!product) {
      console.log("Product not found:", id);
      return res.status(404).json({ message: "Product not found" });
    }

    console.log(
      "Before clearing - ratings:",
      product.ratings,
      "comments:",
      product.comments
    );

    // Clear ratings and comments
    product.ratings = [];
    product.comments = [];
    product.averageRating = 0;

    await product.save();
    console.log("Ratings and comments cleared successfully for product:", id);
    res.json({ message: "Ratings and comments cleared successfully" });
  } catch (err) {
    console.error("Error clearing ratings:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
