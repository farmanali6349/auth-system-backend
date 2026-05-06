import { z } from 'zod';

// Password Schema
export const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters long')
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    'Password must contain at least one letter, one number, and one special character',
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

  password: passwordSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Token blacklist schema
export const tokenBlacklistSchema = z.object({
  token: z.string().min(1, 'Token cannot be empty'),
  createdAt: z.date().optional(),
});
