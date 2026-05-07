import { ApiError } from './ApiError.util.js';

export const validateSchema = (schema, data, errorMessage = 'Invalid Data') => {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw ApiError.badRequest(errorMessage, result.error.issues);
  }

  return result.data;
};
