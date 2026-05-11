import { validateSchema } from '../utils/validateSchema.util.js';
import { findUserByEmail, generateOtp, insertUser, verifyOtp } from '../services/user.service.js';
import {
  generateAccessToken,
  generateAuthToken,
  generateHash,
  generateRefreshToken,
  validatePassword,
} from '../utils/auth.util.js';
import { ApiResponse } from '../utils/ApiResponse.util.js';
import { asyncHandler } from '../utils/asyncHandler.util.js';
import { registerSchema, loginSchema } from '../validation/validation.js';
import { IS_DEV } from '../config/config.js';
import { ApiError } from '../utils/ApiError.util.js';
import { createSession } from '../services/session.service.js';
import { revokeSessionByToken } from '../services/session.service.js';
import { sendOtp } from '../utils/sendOtp.util.js';

export const registerUser = asyncHandler(async (req, res) => {
  // Validate the payload (firstName, lastName, email & password)
  const registerPayload = validateSchema(
    registerSchema,
    req.body,
    'Invalid Payload To Register User',
  );

  const hashedPassword = await generateHash(registerPayload.password);
  // Register User
  const user = await insertUser({ ...registerPayload, password: hashedPassword });
  if (user) {
    return res
      .status(201)
      .json(new ApiResponse(201, 'User Registered Successfully', user).toJSON());
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  // Validate the payload (email & password)
  const loginPayload = validateSchema(loginSchema, req.body, 'Invalid Payload To Login User');

  try {
    const user = await findUserByEmail(loginPayload.email);
    const unAuthError = ApiError.unAuthorized('Login Failed: Email or Password is wrong');

    if (!user) {
      throw unAuthError;
    }
    // Validate The Password
    const isValidPassword = await validatePassword(loginPayload.password, user.password);

    if (!isValidPassword) {
      throw unAuthError;
    }

    const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

    // Create The Session Here
    const session = await createSession(user?.id, refreshToken, req?.ip, req.headers['user-agent']);

    const accessToken = generateAccessToken({
      sessionId: session.id,
      id: user.id,
      email: user.email,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: !IS_DEV,
      secure: !IS_DEV,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days Expiry
      ...(!IS_DEV ? { sameSite: strict } : {}),
    });

    return res.status(200).json(
      new ApiResponse(200, 'LoggedIn Successfully', {
        ...user,
        password: null,
        accessToken,
      }).toJSON(),
    );
  } catch (error) {
    throw error;
  }
});

// Always use auth middleware before this route
export const userProfile = asyncHandler((req, res) => {
  if (!req.user) {
    throw ApiError.unAuthorized('No User Profile: Please login / Sign Up');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, 'Profile retrieved successfully', req.user).toJSON());
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req?.cookies?.refreshToken;

  if (!refreshToken) {
    return ApiError.unAuthorized('Unauthorized: Invalid or expired token');
  }

  const revokedSession = await revokeSessionByToken(refreshToken);
  res.clearCookie('refreshToken');
  return res.status(200).json({ message: 'Logged out successfully' });
});

// Generate Otp Password
export const generateOtpPassword = asyncHandler(async (req, res) => {
  const user = req?.user;

  if (!user) {
    throw ApiError.unAuthorized('Unauthorized: Expired or Invalid Token');
  }

  const otp = await generateOtp(user.email);

  // Send OTP
  await sendOtp(user.email, otp?.otp);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        'OTP Password generated and will expire in 10 mins, please verify',
      ).toJSON(),
    );
});

export const verifyOtpPassword = asyncHandler(async (req, res) => {
  const user = req?.user;

  if (!user) {
    throw ApiError.unAuthorized('Unauthorized: Expired or Invalid Token');
  }

  const otp = Number.parseInt(req?.body?.otp);

  if (!otp || !(typeof otp === 'number') || Number.isNaN(otp)) {
    throw ApiError.badRequest('Empty or invalid OTP');
  }

  const isVerified = await verifyOtp(user?.email, otp);

  if (!isVerified) {
    throw ApiError.badRequest('Wrong or Expired OTP, Please try again');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, 'OTP verification successfull', { email: user?.email, otp }));
});
