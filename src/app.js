import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { CORS_ORIGIN, IS_DEV } from './config/config.js';
import { notFound } from './middlewares/notFound.middleware.js';
import { errorHander } from './middlewares/error.middleware.js';
import { asyncHandler } from './utils/asyncHandler.util.js';
import { ApiResponse } from './utils/ApiResponse.util.js';
import { accessLogStream } from './utils/accessLogStream.util.js';
import { userRouter } from './routes/user.route.js';
export const app = express();

// MIDDLEWARES
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (!IS_DEV) {
  app.use(morgan('combined', { stream: accessLogStream }));
} else {
  app.use(morgan('dev'));
}

app.get(
  '/',
  asyncHandler((req, res, next) => {
    const response = new ApiResponse(200, 'Server is running');
    res.status(response.statusCode).json(response.toJSON());
  }),
);

// User Route
app.use('/api/v1/users', userRouter);
// 404 Handler
app.use(notFound);

// Global Error Handler
app.use(errorHander);
