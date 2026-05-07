import { eq } from 'drizzle-orm';
import { IS_DEV } from '../config/config.js';
import { db } from '../database/db.js';
import { tokenBlacklist } from '../database/schema.js';
import { ApiError } from '../utils/ApiError.util.js';

export const findToken = async (authToken) => {
  try {
    const [token] = await db
      .select()
      .from(tokenBlacklist)
      .where(eq(tokenBlacklist.token, authToken))
      .limit(1);

    return token;
  } catch (error) {
    if (IS_DEV) {
      console.log('Error occured during finding token', error);
    }
    throw ApiError.internalServerError('Error Occurred during finding token');
  }
};
