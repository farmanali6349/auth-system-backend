import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/config.js';
import { ApiError } from './ApiError.util.js';

// TOKEN RELATED FUNCTIONS
// Auth Token
export const generateAuthToken = (data) => {
  return jwt.sign(data, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN || '1d',
  });
};

// Access Token
export const generateAccessToken = (data) => {
  return jwt.sign(data, JWT_SECRET, {
    expiresIn: '15m',
  });
};

// Refresh Token
export const generateRefreshToken = (data) => {
  return jwt.sign(data, JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Decode The Token
export const decodeToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw ApiError.unAuthorized('Invalid/Expired Token Please SignIn');
  }
};

// HASH/PASSWORD RELATED FUNCTIONS
export const generateHash = async (password) => {
  try {
    return await bcrypt.hash(password, 12);
  } catch (error) {
    throw ApiError.internalServerError('Error hashing the password');
  }
};

export const validatePassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw ApiError.internalServerError('Error comparing the password');
  }
};
