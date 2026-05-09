import express from 'express';
import { loginUser, logout, registerUser, userProfile } from '../controllers/user.controller.js';
import { authenticateToken, authUser } from '../middlewares/auth.middleware.js';

export const userRouter = express.Router();

userRouter.get('/users', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Users are present',
  });
});

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', logout);
userRouter.post('/profile', authenticateToken, userProfile);
