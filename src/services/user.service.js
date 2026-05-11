import { ApiError } from '../utils/ApiError.util.js';
import { validateSchema } from '../utils/validateSchema.util.js';
import { otpVerificationSchema, userSchema } from '../validation/validation.js';
import { db } from '../database/db.js';
import { otpVerification, users } from '../database/schema.js';
import { and, eq, gt } from 'drizzle-orm';
import { IS_DEV } from '../config/config.js';
export const insertUser = async (data) => {
  try {
    const userData = validateSchema(userSchema, data);

    const [newUser] = await db
      .insert(users)
      .values({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
      })
      .onConflictDoNothing({ target: users.email })
      .returning({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
      });

    if (newUser) {
      return newUser;
    } else {
      throw ApiError.badRequest('User Already exisits');
    }
  } catch (error) {
    throw error;
  }
};

export const findUserByEmail = async (email) => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        password: users.password,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user;
  } catch (error) {
    if (IS_DEV) {
      console.log('Error occured finding user with email : ', error);
    }
    throw ApiError.notFound('User not exists');
  }
};

export const findUserById = async (userId) => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return user;
  } catch (error) {
    if (IS_DEV) {
      console.log('Error occured finding user with Id : ', error);
    }
    throw ApiError.notFound('User not exists');
  }
};

export const generateOtp = async (email) => {
  try {
    const otpNumber = Math.floor(1000 + Math.random() * 9000);

    const otpPayload = validateSchema(otpVerificationSchema, {
      email,
      otp: otpNumber,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    const result = await db.insert(otpVerification).values(otpPayload).returning();
    const otp = Array.isArray(result) ? result[0] : result;
    return otp;
  } catch (error) {
    if (IS_DEV) {
      console.log('Error in OTP Generation', error);
    }
    throw ApiError.internalServerError('OTP Generation Failed', error);
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const result = await db
      .select()
      .from(otpVerification)
      .where(
        and(
          eq(otpVerification.email, email),
          eq(otpVerification.otp, otp),
          gt(otpVerification.expiresAt, new Date()),
        ),
      );

    if (!result.length > 0) {
      return false;
    }

    // If OTP is verified, now make user also verified
    await db
      .update(users)
      .set({
        isVerified: true,
        updatedAt: new Date(),
      })
      .where(eq(users.email, email));

    return true;
  } catch (error) {
    if (IS_DEV) console.log('Error in OTP verification :: ', error);
    throw ApiError.badRequest('Error in OTP verification', error);
  }
};
