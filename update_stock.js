const mongoose = require("mongoose");
const Product = require("./Backend/models/Product");

async function updateStock() {
  try {
    await mongoose.connect("mongodb://localhost:27017/chinclothe", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const productId = "691dceef85b045522ca5585c"; // From the log
    const product = await Product.findById(productId);
    if (product) {
      product.stock = 10; // Set stock to 10
      await product.save();
      console.log("Product stock updated to 10");
    } else {
      console.log("Product not found");
    }

    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

updateStock();
