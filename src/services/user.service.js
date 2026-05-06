import { validateSchema } from '../utils/validateSchema.util.js';
import { userSchema } from '../validation/validation.js';

export const registerUser = async (data) => {
  try {
    const userData = validateSchema(userSchema, data);
  } catch (error) {
    throw error;
  }
};
