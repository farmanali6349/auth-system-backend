import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { CORS_ORIGIN } from './config/config.js';
export const app = express();

// MIDDLEWARES
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running absolutely fine.',
  });
});
