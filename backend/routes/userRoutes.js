import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getMe } from "../controllers/user.controller.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";


dotenv.config();
const router = express.Router();

/* =============================================
   🧾 REGISTER USER
============================================= */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered. Please login instead.",
      });
    }

    // Create and save new user (password gets hashed automatically)
    const user = new User({ name, email, password, role });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: user.toJSON(), // removes password field safely
    });
  } catch (err) {
    // Handle Mongo duplicate key errors gracefully
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already registered.",
      });
    }

    res.status(400).json({ success: false, message: err.message });
  }
});

/* =============================================
   🔐 LOGIN USER
============================================= */
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email and include password for comparison
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: user.toJSON(), // removes password automatically
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/me",protect,getMe);

export default router;
