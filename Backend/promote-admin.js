const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/chinclothe";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user", enum: ["user", "admin"] },
});

const User = mongoose.model("User", userSchema);

async function promoteToAdmin() {
  const email = process.argv[2];

  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB\n");

    if (!email) {
      const users = await User.find({}).select("name email role").lean();
      console.log("Existing users:");
      console.table(users);
      console.log("\nUsage: node promote-admin.js <email>");
      await mongoose.disconnect();
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.error(`No user found with email: ${email}`);
      console.log("\nExisting users:");
      const users = await User.find({}).select("name email role").lean();
      console.table(users);
      process.exit(1);
    }

    if (user.role === "admin") {
      console.log(`User ${email} is already an admin.`);
      await mongoose.disconnect();
      return;
    }

    user.role = "admin";
    await user.save();
    console.log(`Successfully promoted ${email} (${user.name}) to admin.`);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

promoteToAdmin();
