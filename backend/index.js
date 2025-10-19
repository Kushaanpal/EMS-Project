import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import userRoutes from "./routes/userRoutes.js";
import expensesRoutes from "./routes/expensesRoutes.js";

import Expense from "./models/Expense.js";
import User from "./models/User.js";

dotenv.config({ path: './config/.env' });

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;
const DB_URI = process.env.MONGO_URI;

try {
  await mongoose.connect(DB_URI);
  console.log("Connected to MongoDB");

  // Seed sample expenses if none exist
  const expenseCount = await Expense.countDocuments();
  if (expenseCount === 0) {
    const demoUser = await User.findOne({ email: "rishit@gmail.com" });
    if (demoUser) {
      const sampleExpenses = [
        {
          createdBy: demoUser._id,
          title: "October Rent",
          category: "Rent",
          amount: 15000,
          date: new Date("2025-10-01"),
          description: "Monthly PG rent",
          branch: "Main",
        },
        {
          createdBy: demoUser._id,
          title: "Monthly Maintenance",
          category: "Maintenance",
          amount: 2000,
          date: new Date("2025-10-03"),
          description: "General maintenance and repairs",
          branch: "Main",
        },
        {
          createdBy: demoUser._id,
          title: "Electricity Bill",
          category: "Electricity",
          amount: 3000,
          date: new Date("2025-10-05"),
          description: "Electricity charges for the month",
          branch: "Main",
        },
        {
          createdBy: demoUser._id,
          title: "Groceries",
          category: "Groceries",
          amount: 1500,
          date: new Date("2025-10-07"),
          description: "Groceries for common kitchen",
          branch: "Main",
        },
        {
          createdBy: demoUser._id,
          title: "Staff Salary",
          category: "Salary",
          amount: 3500,
          date: new Date("2025-10-10"),
          description: "Salaries for PG staff",
          branch: "Main",
        },
        {
          createdBy: demoUser._id,
          title: "Miscellaneous Expenses",
          category: "Miscellaneous",
          amount: 500,
          date: new Date("2025-10-12"),
          description: "Other minor expenses",
          branch: "Main",
        },
      ];

      await Expense.insertMany(sampleExpenses);
      console.log("Sample expenses inserted successfully!");
    } else {
      console.log("Demo user not found. Create a user first to insert sample expenses.");
    }
  }
} catch (error) {
  console.error("MongoDB connection error:", error);
}

// Routes
app.use("/api/users", userRoutes);
app.use("/api/expenses", expensesRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
