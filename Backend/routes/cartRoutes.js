const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { authenticateToken } = require("../middleware/auth");

// Get current user's cart (requires auth)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.productId"
    );
    if (!cart) return res.json({ items: [] }); // empty cart if none found
    res.json(cart); // { items: [{ productId: {...}, quantity: 1 }, ...] } but populated
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add product to cart (requires auth) - POST /api/cart/add
router.post("/add", authenticateToken, async (req, res) => {
  try {
    const { productId, quantity = 1, color = "", size = "" } = req.body;
    if (!productId)
      return res.status(400).json({ error: "Product ID required" });

    // Check if product exists (stock check commented out for debugging)
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });
    // console.log(`Product stock: ${product.stock}, requested quantity: ${quantity}`);
    // if (product.stock < quantity) return res.status(400).json({ error: "Insufficient stock" });

    // Find or create cart for user
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    // Check if product with same color and size already in cart, update quantity or add new item
    const existingItem = cart.items.find(
      (item) =>
        item.productId.toString() === productId &&
        item.color === color &&
        item.size === size
    );
    if (existingItem) {
      existingItem.quantity += quantity; // increment quantity
    } else {
      cart.items.push({ productId, quantity, color, size }); // add new item
    }

    await cart.save();
    // Populate and return updated cart
    await cart.populate("items.productId");
    res.json(cart); // { items: [{ productId: {...}, quantity: 1 }, ...] } but populated
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update cart item quantity (requires auth) - PUT /api/cart/update/:itemId
router.put("/update/:itemId", authenticateToken, async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity <= 0)
      return res.status(400).json({ error: "Quantity must be positive" });

    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.productId"
    );
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.id(req.params.itemId); // find subdoc by id
    if (!item) return res.status(404).json({ error: "Item not found in cart" });

    item.quantity = quantity; // update quantity
    await cart.save();
    res.json(cart); // return updated populated cart
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove item from cart (requires auth) - DELETE /api/cart/remove/:itemId
router.delete("/remove/:itemId", authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.productId"
    );
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items.pull(req.params.itemId); // remove subdoc by id
    await cart.save();
    res.json(cart); // return updated populated cart
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
