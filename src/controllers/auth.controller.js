import { ApiError } from '../utils/ApiError.util.js';
import { asyncHandler } from '../utils/asyncHandler.util.js';
import { decodeToken, generateAccessToken, generateRefreshToken } from '../utils/auth.util.js';
import { ApiResponse } from '../utils/ApiResponse.util.js';
import { findActiveSession } from '../services/session.service.js';

// Refresh Token
export const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const authError = ApiError.unAuthorized('Unauthorized: Invalid or Expired Token');

  if (!refreshToken) {
    throw authError;
  }

  // if session not exists, then un-auth
  // if session exists then new accessToken and return.

  const decodedData = decodeToken(refreshToken);
  const userId = decodedData?.id ?? Number.parseInt(decodedData?.id) ?? undefined;
  if (!userId || Number.isNaN(userId)) {
    throw authError;
  }

  // Check for active session with this token
  // equal -> refreshToken & false -> revoked
  const activeSession = await findActiveSession(refreshToken);

  const newAccessToken = generateAccessToken({
    id: userId,
    email: decodedData?.email,
    sessionId: activeSession?.id,
  });

  return res
    .status(200)
    .json(new ApiResponse({ ...decodedData, accessToken: newAccessToken }).toJSON());
});
