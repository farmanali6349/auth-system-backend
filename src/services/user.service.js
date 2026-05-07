import { ApiError } from '../utils/ApiError.util.js';
import { validateSchema } from '../utils/validateSchema.util.js';
import { userSchema } from '../validation/validation.js';
import { db } from '../database/db.js';
import { users } from '../database/schema.js';
import { eq } from 'drizzle-orm';
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
