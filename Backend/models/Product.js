const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    imageUrl: [{ type: String, required: true }], // optional fallback/default images
    colors: [
      {
        color: { type: String, required: true }, // e.g., "red", "blue"
        image: { type: String, required: true }, // image URL for this color
      },
    ],
    sizes: [{ type: String }], // e.g., ["S", "M", "L", "XL"]
    averageRating: { type: Number, min: 0, max: 5, default: 0 },
    ratings: [{ type: Number, min: 1, max: 5 }],
    stock: { type: Number, default: 0 },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
