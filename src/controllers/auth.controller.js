import { ApiError } from '../utils/ApiError.util.js';
import { asyncHandler } from '../utils/asyncHandler.util.js';
import { decodeToken, generateAccessToken } from '../utils/auth.util.js';
import { ApiResponse } from '../utils/ApiResponse.util.js';

// Refresh Token
export const refreshToken = asyncHandler((req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const authError = ApiError.unAuthorized('Unauthorized: Invalid or Expired Token');

  if (!refreshToken) {
    throw authError;
  }

  const decodedData = decodeToken(refreshToken);
  const userId = decodedData?.id ?? Number.parseInt(decodedData?.id) ?? undefined;
  if (!userId || Number.isNaN(userId)) {
    throw authError;
  }

  const newAccessToken = generateAccessToken({ id: userId, email: decodedData?.email });
  return res
    .status(200)
    .json(new ApiResponse({ ...decodedData, accessToken: newAccessToken }).toJSON());
});
