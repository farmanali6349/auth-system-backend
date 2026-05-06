import express from 'express';
import { validateSchema } from '../utils/validateSchema.util.js';
import { registerSchema } from '../validation/validation.js';
import { asyncHandler } from '../utils/asyncHandler.util.js';
import { registerUser } from '../services/user.service.js';
export const userRouter = express.Router();

userRouter.get('/users', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Users are present',
  });
});

userRouter.post(
  '/register',
  asyncHandler(async (req, res) => {
    // Validate the payload (firstName, lastName, email & password)
    const registerPayload = validateSchema(
      registerSchema,
      req.body,
      'Invalid Payload To Register User',
    );

    // Register User
    const user = await registerUser();
    // Validate the schema
  }),
);
