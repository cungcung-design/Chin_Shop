const express = require("express");
const router = express.Router();

const authAdmin = require("../middleware/authAdmin");

// =====================
// MODELS
// =====================
const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");

// ==================================================
// DASHBOARD
// ==================================================

router.get("/dashboard", authAdmin, async (req, res) => {
  try {
    const users = await User.countDocuments();
    const products = await Product.countDocuments();
    const categories = await Category.countDocuments();
    const orders = await Order.countDocuments();

    res.json({
      users,
      products,
      categories,
      orders,
    });
  } catch (err) {
    console.error("Dashboard error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// ==================================================
// USERS
// ==================================================

// GET ALL USERS
router.get("/users", authAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (err) {
    console.error("Get users error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// GET USER BY ID
router.get("/users/:id", authAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (err) {
    console.error("Get user error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// UPDATE USER
router.put("/users/:id", authAdmin, async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        role,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (err) {
    console.error("Update user error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// DELETE USER
router.delete("/users/:id", authAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("Delete user error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// ==================================================
// PRODUCTS
// ==================================================

// GET ALL PRODUCTS
router.get("/products", authAdmin, async (req, res) => {
  try {
    const products = await Product.find().populate("categoryId");

    res.json(products);
  } catch (err) {
    console.error("Get products error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// CREATE PRODUCT
router.post("/products", authAdmin, async (req, res) => {
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
      colors,
      sizes,
    });

    await product.save();

    res.status(201).json(product);
  } catch (err) {
    console.error("Create product error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// UPDATE PRODUCT
router.put("/products/:id", authAdmin, async (req, res) => {
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

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        stock,
        categoryId,
        imageUrl,
        colors,
        sizes,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (err) {
    console.error("Update product error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// DELETE PRODUCT
router.delete("/products/:id", authAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error("Delete product error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// ==================================================
// CATEGORIES
// ==================================================

// GET ALL CATEGORIES
router.get("/categories", authAdmin, async (req, res) => {
  try {
    const categories = await Category.find();

    res.json(categories);
  } catch (err) {
    console.error("Get categories error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// CREATE CATEGORY
router.post("/categories", authAdmin, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const category = new Category({
      name,
    });

    await category.save();

    res.status(201).json(category);
  } catch (err) {
    console.error("Create category error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// UPDATE CATEGORY
router.put("/categories/:id", authAdmin, async (req, res) => {
  try {
    const { name } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json(category);
  } catch (err) {
    console.error("Update category error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// DELETE CATEGORY
router.delete("/categories/:id", authAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json({
      message: "Category deleted successfully",
    });
  } catch (err) {
    console.error("Delete category error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// ==================================================
// ORDERS
// ==================================================

// GET ALL ORDERS
router.get("/orders", authAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("items.product", "name price imageUrl")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Get orders error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// GET ORDER BY ID
router.get("/orders/:id", authAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email")
      .populate("items.product", "name price imageUrl");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);
  } catch (err) {
    console.error("Get order error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// UPDATE ORDER
router.put("/orders/:id", authAdmin, async (req, res) => {
  try {
    const {
      phone,
      name,
      address,
      city,
      country,
      postalCode,
      deliveryMethod,
      paymentMethod,
      deliveryFee,
      totalPay,
    } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Shipping / contact info
    if (phone !== undefined) order.phone = phone;
    if (name !== undefined) order.name = name;
    if (address !== undefined) order.address = address;
    if (city !== undefined) order.city = city;
    if (country !== undefined) order.country = country;
    if (postalCode !== undefined) order.postalCode = postalCode;
    if (deliveryMethod !== undefined) order.deliveryMethod = deliveryMethod;
    if (paymentMethod !== undefined) order.paymentMethod = paymentMethod;

    // Subtotal always follows the stored line items
    order.subtotal = order.items.reduce((sum, item) => sum + item.total, 0);

    // Delivery fee follows the same rule as order creation (see routes/orderRoutes.js),
    // unless an admin explicitly overrides it
    if (deliveryFee !== undefined) {
      order.deliveryFee = deliveryFee;
    } else {
      order.deliveryFee = order.deliveryMethod === "express" ? 10 : 0;
    }

    // Keep totalPay consistent with subtotal + deliveryFee
    if (totalPay !== undefined) {
      order.totalPay = totalPay;
    } else {
      order.totalPay = order.subtotal + order.deliveryFee;
    }

    await order.save();

    await order.populate([
      { path: "userId", select: "name email" },
      { path: "items.product", select: "name price imageUrl" },
    ]);

    res.json(order);
  } catch (err) {
    console.error("Update order error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// DELETE ORDER
router.delete("/orders/:id", authAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      message: "Order deleted successfully",
    });
  } catch (err) {
    console.error("Delete order error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;