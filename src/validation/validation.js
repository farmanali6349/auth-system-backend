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

// Session Validation
export const sessionSchema = z.object({
  userId: z.number().positive(),
  refreshToken: z.string().min(1, 'Refresh Token Hash Is Required'),
  ip: z.string().min(1, 'IP address Is Required'),
  userAgent: z.string().optional(),
  revoked: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const otpVerificationSchema = z.object({
  email: z
    .string({ required_error: 'Email is required', invalid_type_error: 'Email must be a string' })
    .email('Invalid email format')
    .max(128, 'Email must be at most 128 characters'),

  otp: z
    .number({ required_error: 'OTP is required', invalid_type_error: 'OTP must be a number' })
    .int('OTP must be an integer')
    .min(1000, 'OTP must be a 4-digit number')
    .max(9999, 'OTP must be a 4-digit number'),

  createdAt: z.date().optional(),

  expiresAt: z.date({
    required_error: 'ExpiresAt is required',
    invalid_type_error: 'ExpiresAt must be a valid date',
  }),
});
