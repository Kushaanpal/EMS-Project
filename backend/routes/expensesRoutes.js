import express from "express";
import { authorize, protect } from "../middlewares/authMiddleware.js";
import Expense, { expenseUpdateSchema } from "../models/Expense.js";
import mongoose from "mongoose";
import { z } from 'zod';

const router = express.Router();

// --- GET /api/expenses/dashboard/all --- Get all expenses
router.get("/all", protect, async (req, res) => {
  try {
    // Fetch all expenses, sorted by date descending
    const expenses = await Expense.find().sort({ date: -1 });

    res.status(200).json({ success: true, expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- POST /api/expenses --- Create new expense
router.post("/create", protect, authorize("admin"), async (req, res) => {
  try {
    const { title, category, amount, date, description, branch } = req.body;
    const userId = req.user._id; // optional tracking

    // Validate required fields
    if (!title || !category || !amount || !date) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, category, amount, and date",
      });
    }

    // Validate amount
    const numericAmount = parseFloat(amount);
    if (numericAmount <= 0 || isNaN(numericAmount)) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a valid number greater than 0",
      });
    }

    // Round amount to 2 decimals

const roundedAmount = Number(numericAmount.toFixed(2));


    // Create expense
    const expense = await Expense.create({
      createdBy: userId,       // optional
      title,
      category,
      amount: roundedAmount,   // use rounded value
      date: new Date(date),
      description: description || "",
      branch: branch || "Main",
    });

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      data: expense,
    });
  } catch (error) {
    console.error("Create expense error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add expense",
    });
  }
});

router.get(`/edit/:id`,async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id)

    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid expense ID' 
      });
    }

    // Find expense by ID and populate creator info
    const expense = await Expense.findById(id).populate('createdBy', 'name email role');
    // console.log(expense)
    // Check if expense exists
    if (!expense) {
      return res.status(404).json({ 
        success: false,
        message: 'Expense not found' 
      });
    }

    res.json({
      success: true,
      expense,
    });

  } catch (error) {
    console.error('Error fetching expense:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }}
)



router.put(`/edit/:id`,async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid expense ID' 
      });
    }

    // Validate update data with Zod schema
    const validatedData = expenseUpdateSchema.parse(updateData);

    // Check if expense exists
    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ 
        success: false,
        message: 'Expense not found' 
      });
    }

    // Update the expense with validated data
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      {
        ...validatedData,
        updatedAt: new Date(),
      },
      { 
        new: true, // Return updated document
        runValidators: true // Run schema validators
      }
    ).populate('createdBy', 'name email role');

    res.json({
      success: true,
      message: 'Expense updated successfully',
      expense: updatedExpense,
    });

  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: error.errors[0].message,
        errors: error.errors,
      });
    }

    console.error('Error updating expense:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }}
)

router.delete('/delete/:id',protect, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid expense ID' 
      });
    }

    // Check if expense exists
    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ 
        success: false,
        message: 'Expense not found' 
      });
    }

    // Delete the expense
    await Expense.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Expense deleted successfully',
      expenseId: id,
    });

  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
});

export default router;
