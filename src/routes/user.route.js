import express from 'express';
import { loginUser, registerUser, userProfile } from '../controllers/user.controller.js';
import { authUser } from '../middlewares/auth.middleware.js';

export const userRouter = express.Router();

userRouter.get('/users', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Users are present',
  });
});

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/profile', authUser, userProfile);
