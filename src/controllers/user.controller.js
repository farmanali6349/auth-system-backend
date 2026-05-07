import { validateSchema } from '../utils/validateSchema.util.js';
import { findUserByEmail, insertUser } from '../services/user.service.js';
import { generateAuthToken, generateHash, validatePassword } from '../utils/auth.util.js';
import { ApiResponse } from '../utils/ApiResponse.util.js';
import { asyncHandler } from '../utils/asyncHandler.util.js';
import { registerSchema, loginSchema } from '../validation/validation.js';
import { IS_DEV } from '../config/config.js';
import { ApiError } from '../utils/ApiError.util.js';
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

    const authToken = generateAuthToken({ id: user.id, email: user.email });
    res.cookie('authToken', authToken, {
      httpOnly: !IS_DEV,
      secure: !IS_DEV,
      maxAge: 24 * 60 * 60 * 1000,
      ...(!IS_DEV ? { sameSite: strict } : {}),
    });

    return res.status(200).json(
      new ApiResponse(200, 'LoggedIn Successfully', {
        ...user,
        password: null,
        authToken,
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
