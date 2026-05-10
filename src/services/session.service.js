import { generateHash } from '../utils/auth.util.js';
import { sessions } from '../database/schema.js';
import { sessionSchema } from '../validation/validation.js';
import { validateSchema } from '../utils/validateSchema.util.js';
import { ApiError } from '../utils/ApiError.util.js';
import { IS_DEV } from '../config/config.js';
import { db } from '../database/db.js';
import { eq, and } from 'drizzle-orm';

export const createSession = async (userId, refreshToken, ip, userAgent) => {
  const normalizedSessionData = { userId, refreshToken, ip, userAgent, revoked: false };

  try {
    const sessionData = validateSchema(sessionSchema, normalizedSessionData);
    // Create Session
    const [session] = await db.insert(sessions).values(sessionData).returning();

    return session;
  } catch (error) {
    if (IS_DEV) console.log(error);

    throw ApiError.internalServerError('Invalid Session Data');
  }
};

export const revokeSessionByToken = async (token) => {
  try {
    const [revokedSession] = await db
      .update(sessions)
      .set({
        revoked: true,
        updatedAt: new Date(),
      })
      .where(eq(sessions.refreshToken, token))
      .returning();

    if (!revokedSession) {
      throw ApiError.internalServerError('Unable to revoke Session');
    }

    return revokeSessionByToken;
  } catch (error) {
    if (IS_DEV) console.log(error);
    throw error;
  }
};

export const findActiveSession = async (token) => {
  try {
    const queryRes = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.refreshToken, token), eq(sessions.revoked, false)))
      .limit(1);

    const session = Array.isArray(queryRes) ? queryRes[0] : queryRes;

    if (!session) {
      throw ApiError.unAuthorized('Unauthorized: Invalid or Expired Token, Please Login');
    }

    return session;
  } catch (error) {
    console.log('Error occcured while finding active session', error);
    throw error;
  }
};
