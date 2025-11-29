const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const { authenticateToken } = require("../middleware/auth");

// Optional admin middleware
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  return res.status(403).json({ error: "Admin only" });
};

// ===================== CREATE ORDER (FIXED - MERGE DUPLICATES) =====================
router.post("/create", authenticateToken, async (req, res) => {
  try {
    const {
      deliveryMethod,
      paymentMethod,
      phone,
      name,
      address,
      city,
      country,
      postalCode,
      items,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Order items missing" });
    }

    // Keep items separate without merging duplicates
    const mergedItems = items.map((item) => ({
      product: item.product,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
      total: item.price * (item.quantity || 1),
      color: item.color,
      size: item.size,
      imageUrl: item.imageUrl,
    }));

    // CALCULATE FEES
    const subtotal = mergedItems.reduce((sum, item) => sum + item.total, 0);
    const deliveryFee = deliveryMethod === "express" ? 10 : 0;
    const totalPay = subtotal + deliveryFee;

    //  SAVE ORDER
    const order = new Order({
      userId: req.user.id,
      phone,
      name,
      address,
      city,
      country,
      postalCode,
      items: mergedItems,
      subtotal,
      deliveryMethod,
      paymentMethod,
      deliveryFee,
      totalPay,
    });

    await order.save();

    // clear cart
    const cart = await Cart.findOne({ userId: req.user.id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ===================== GET ORDERS FOR USER =====================
router.get("/", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate("items.product")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===================== GET ORDER BY ID =====================
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");
    if (!order) return res.status(404).json({ error: "Order not found" });

    // if user is not owner and not admin, deny
    if (
      !order.userId.equals(req.user.id) &&
      (!req.user.role || req.user.role !== "admin")
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===================== ADMIN: GET ALL ORDERS =====================
router.get("/admin/all", authenticateToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.product userId", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===================== ADMIN: DELETE ORDER =====================
router.delete("/admin/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    await Order.findByIdAndDelete(req.params.id);

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
