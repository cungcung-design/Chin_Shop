// models/Order.js
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  phone: { type: String },
  name: { type: String },
  address: { type: String },
  city: { type: String },
  country: { type: String },
  postalCode: { type: String },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      phone: String,
      address: String,
      city: String,
      country: String,
      postalCode: String,
      price: Number,
      quantity: Number,
      total: Number,
       color: String,
      size: String,
      imageUrl: [String],
    },
  ],
  subtotal: Number,
  deliveryMethod: {
    type: String,
    enum: ["standard", "express"],
    default: "standard",
  },
  paymentMethod: {
    type: String,
    enum: ["credit", "paypal", "cod"],
    default: "credit",
  },
  deliveryFee: { type: Number, default: 0 },
  totalPay: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
