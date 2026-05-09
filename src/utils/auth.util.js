import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { JWT_SECRET, JWT_EXPIRES_IN, IS_DEV } from '../config/config.js';
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
  try {
    return jwt.sign(data, JWT_SECRET, {
      expiresIn: '15m',
    });
  } catch (err) {
    if (IS_DEV) {
      console.log('Error in generating the access token :: ', err);
    }
  }
};

// Refresh Token
export const generateRefreshToken = (data) => {
  try {
    return jwt.sign(data, JWT_SECRET, {
      expiresIn: '7d',
    });
  } catch (error) {
    if (IS_DEV) {
      console.log('Error in generating the refresh token :: ', err);
    }
  }
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
