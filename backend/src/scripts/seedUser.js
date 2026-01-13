require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected (seed user)");
};

const createUser = async () => {
  try {
    await connectDB();

    const existingUser = await User.findOne({
      email: "user@infratrack.com",
    });

    if (existingUser) {
      console.log("User already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("user123", 10);

    await User.create({
      name: "Test User",
      email: "user@infratrack.com",
      password: hashedPassword,
      role: "user",
    });

    console.log("User created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

createUser();
