import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// ===== ZOD SCHEMAS FOR VALIDATION =====

// User registration/signup validation
export const userSignUpSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must not exceed 50 characters')
    .trim(),
  email: z.string()
    .email('Please provide a valid email')
    .toLowerCase(),
  password: z.string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must not exceed 100 characters'),
  role: z.enum(['admin', 'staff']).optional().default('staff'),
  pgName: z.string().trim().optional(),
  phone: z.string()
    .regex(/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number')
    .optional()
    .or(z.literal('')),
});

// User login validation
export const userSignInSchema = z.object({
  email: z.string()
    .email('Please provide a valid email')
    .toLowerCase(),
  password: z.string()
    .min(6, 'Password must be at least 6 characters long'),
});

// User update validation
export const userUpdateSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must not exceed 50 characters')
    .trim()
    .optional(),
  pgName: z.string().trim().optional(),
  phone: z.string()
    .regex(/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number')
    .optional()
    .or(z.literal('')),
  isActive: z.boolean().optional(),
});

// ===== MONGOOSE SCHEMA =====

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Don't return password by default in queries
    },
    role: {
      type: String,
      enum: ['admin', 'staff'],
      default: 'staff',
    },
    pgName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get user data without sensitive info
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model('User', userSchema);

export default User;