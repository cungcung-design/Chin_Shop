require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("./models/Category");
const Product = require("./models/Product");

const MONGO_URI = process.env.MONGO_URI;

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log("Cleared existing data");

    // Create categories
    const categories = await Category.create([
      {
        name: "Shawls",
        description: "Traditional Chin weaving techniques presented through elegant contemporary shawl designs.",
        image: "https://images.unsplash.com/photo-1601924634867-3a4c5c3d5a1e?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Jackets",
        description: "Modern fusion jackets combining traditional Chin patterns with contemporary silhouettes.",
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Accessories",
        description: "Carefully crafted accessories inspired by traditional Chin textiles and motifs.",
        image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Traditional Clothing",
        description: "Authentic Chin traditional wear preserving cultural heritage through modern fashion.",
        image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&w=800&q=80",
      },
    ]);

    console.log(`Created ${categories.length} categories`);

    // Create products for each category
    const products = [];
    for (const category of categories) {
      const categoryProducts = [
        {
          name: `${category.name} - Handwoven Piece 1`,
          description: `A beautiful handwoven ${category.name.toLowerCase()} featuring traditional Chin patterns and modern design elements.`,
          price: 129,
          categoryId: category._id,
          imageUrl: [category.image],
          stock: 10,
          averageRating: 4.5,
          ratings: [5, 5, 4, 5, 4],
        },
        {
          name: `${category.name} - Heritage Design`,
          description: `Elegant ${category.name.toLowerCase()} crafted with heritage techniques passed down through generations.`,
          price: 159,
          categoryId: category._id,
          imageUrl: [category.image],
          stock: 8,
          averageRating: 4.8,
          ratings: [5, 5, 5, 4, 5],
        },
        {
          name: `${category.name} - Modern Fusion`,
          description: `Contemporary ${category.name.toLowerCase()} blending traditional Chin aesthetics with modern fashion.`,
          price: 189,
          categoryId: category._id,
          imageUrl: [category.image],
          stock: 5,
          averageRating: 4.2,
          ratings: [4, 5, 4, 4, 5],
        },
      ];
      products.push(...categoryProducts);
    }

    await Product.insertMany(products);
    console.log(`Created ${products.length} products`);

    console.log("Seed completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seed();
