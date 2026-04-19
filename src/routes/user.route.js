import express from 'express';

export const userRouter = express.Router();

userRouter.get('/users', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Users are present',
  });
});
