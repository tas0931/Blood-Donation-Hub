// createAdmin.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/blood_donation";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "donor", "recipient"], default: "recipient" },
  dateOfBirth: String,
  bloodGroup: String,
  location: String,
  mobileNumber: String
});

const User = mongoose.model("User", userSchema);

const createAdminUser = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = new User({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      dateOfBirth: "1980-01-01",
      bloodGroup: "O+",
      location: "Dhaka",
      mobileNumber: "0123456789"
    });

    await admin.save();
    console.log("✅ Admin user created successfully!");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error creating admin user:", err.message);
    mongoose.disconnect();
  }
};

createAdminUser();
