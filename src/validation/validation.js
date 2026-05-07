import { z } from 'zod';

// Password Schema
export const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters long')
  .max(16, 'Password must be at most 16 characters long')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).+$/,
    'Password must contain at least one uppercase, one lowercase, one number, and one special character',
  );

// User schema
export const userSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name cannot be empty')
    .max(50, 'First name must be at most 50 characters'),

  lastName: z
    .string()
    .min(1, 'Last name cannot be empty')
    .max(50, 'Last name must be at most 50 characters'),

  email: z.email('Invalid email format').max(128, 'Email must be at most 128 characters'),

  password: z.string().min(1, 'Password is required'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Register Payload
export const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name cannot be empty')
    .max(50, 'First name must be at most 50 characters'),

  lastName: z
    .string()
    .min(1, 'Last name cannot be empty')
    .max(50, 'Last name must be at most 50 characters'),

  email: z.email('Invalid email format').max(128, 'Email must be at most 128 characters'),
  password: passwordSchema,
});
// Login Payload
export const loginSchema = z.object({
  email: z.email('Invalid email format').max(128, 'Email must be at most 128 characters'),
  password: passwordSchema,
});

// Token blacklist schema
export const tokenBlacklistSchema = z.object({
  token: z.string().min(1, 'Token cannot be empty'),
  createdAt: z.date().optional(),
});
