import express from 'express';
import { ApiError } from '../utils/ApiError.util.js';
import { ApiResponse } from '../utils/ApiResponse.util.js';
import { refreshToken } from '../controllers/auth.controller.js';

export const authRotuer = express.Router();

authRotuer.post('/refresh-token', refreshToken);
