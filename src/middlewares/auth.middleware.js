import { findToken } from '../services/token.service.js';
import { ApiError } from '../utils/ApiError.util.js';
import { asyncHandler } from '../utils/asyncHandler.util.js';
import { decodeToken } from '../utils/auth.util.js';
import { findUserById } from '../services/user.service.js';

export const authUser = asyncHandler(async (req, res, next) => {
  // Get Auth Token
  const token = req?.cookies?.authToken || req?.headers?.authorization?.split(' ')[1];
  // Defining Auth Error
  const authError = ApiError.unAuthorized('Unauthorized :: Invalid, Expired Or No Token');

  if (!token) {
    throw authError;
  }

  const blacklistedToken = await findToken(token);

  if (blacklistedToken) {
    throw authError;
  }

  const decodedToken = decodeToken(token);
  console.log('Decoded Token: ', decodedToken);

  const userId = decodedToken?.id ? Number.parseInt(decodedToken?.id) : null;

  if (!userId || Number.isNaN(userId)) {
    throw authError;
  }

  const user = await findUserById(userId);

  if (!user) {
    throw authError;
  }

  req.user = user;
  req.authToken = token;
  next();
});

// export const authenticate;
