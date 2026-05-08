import { ApiError } from '../utils/ApiError.util';
import { asyncHandler } from '../utils/asyncHandler.util';
import { decodeToken } from '../utils/auth.util';

// Refresh Token
export const refreshToken = asyncHandler((req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const authError = ApiError.unAuthorized('Expired or Inavlid Token');
  if (!refreshToken) {
    throw authError;
  }

  const decodedRefreshToken = decodeToken(refreshToken);

  const userId = decodedRefreshToken?.id ? Number.parseInt(decodedRefreshToken?.id) : null;

  if (!userId || Number.isNaN(userId)) {
    throw authError;
  }
});
