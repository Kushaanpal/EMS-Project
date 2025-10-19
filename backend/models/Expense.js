import mongoose from "mongoose";
import { z } from "zod";

// ===== ZOD SCHEMAS FOR VALIDATION =====

// Create expense validation
export const expenseCreateSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must not exceed 100 characters')
    .trim(),
  category: z.enum(
    ['Rent', 'Electricity', 'Groceries', 'Maintenance', 'Salary', 'Miscellaneous'],
    { errorMap: () => ({ message: 'Invalid category' }) }
  ),
  amount: z.number()
    .positive('Amount must be greater than 0')
    .finite('Amount must be a valid number')
    .max(999999999, 'Amount is too large'),
  date: z.string()
    .datetime('Invalid date format')
    .optional()
    .transform(val => val ? new Date(val) : new Date()),
  description: z.string()
    .max(500, 'Description must not exceed 500 characters')
    .trim()
    .optional()
    .default(''),
  branch: z.string()
    .max(50, 'Branch name must not exceed 50 characters')
    .trim()
    .optional()
    .default('Main'),
});

// Update expense validation (all fields optional)
export const expenseUpdateSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must not exceed 100 characters')
    .trim()
    .optional(),
  category: z.enum(
    ['Rent', 'Electricity', 'Groceries', 'Maintenance', 'Salary', 'Miscellaneous'],
    { errorMap: () => ({ message: 'Invalid category' }) }
  ).optional(),
  amount: z.number()
    .positive('Amount must be greater than 0')
    .finite('Amount must be a valid number')
    .max(999999999, 'Amount is too large')
    .optional(),
  date: z.string()
    .datetime('Invalid date format')
    .optional()
    .transform(val => val ? new Date(val) : undefined),
  description: z.string()
    .max(500, 'Description must not exceed 500 characters')
    .trim()
    .optional(),
  branch: z.string()
    .max(50, 'Branch name must not exceed 50 characters')
    .trim()
    .optional(),
}).refine(data => Object.values(data).some(v => v !== undefined), {
  message: 'At least one field must be provided for update'
});

// Filter/Query validation
export const expenseFilterSchema = z.object({
  category: z.enum(
    ['Rent', 'Electricity', 'Groceries', 'Maintenance', 'Salary', 'Miscellaneous']
  ).optional(),
  startDate: z.string()
    .datetime('Invalid date format')
    .optional(),
  endDate: z.string()
    .datetime('Invalid date format')
    .optional(),
  branch: z.string().optional(),
  minAmount: z.number().min(0).optional(),
  maxAmount: z.number().min(0).optional(),
}).refine(data => {
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) <= new Date(data.endDate);
  }
  return true;
}, {
  message: 'Start date must be before end date',
  path: ['startDate']
});

// ===== MONGOOSE SCHEMA =====

const expenseSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Rent", "Electricity", "Groceries", "Maintenance", "Salary", "Miscellaneous"],
    },
    amount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      min: 0,
      get: v => parseFloat(v.toString()),  // convert Decimal128 to float when reading
      set: v => mongoose.Types.Decimal128.fromString(v.toString()), // convert input to Decimal128
    },
    date: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    branch: {
      type: String,
      default: "Main",
    },
  },
  { 
    timestamps: true,
    toJSON: { getters: true }, // ensures get() is applied during JSON serialization
    toObject: { getters: true },
  }
);

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;