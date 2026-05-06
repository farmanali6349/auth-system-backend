import { IS_DEV } from '../config/config.js';
import { ApiError } from '../utils/ApiError.util.js';

export const errorHander = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const message = error?.message || 'Internal Server Error';
    const errors = Array.isArray(error?.errors) ? error?.errors : [];
    error = ApiError.internalServerError(message, errors);
  }

  if (IS_DEV) {
    console.log('Error Occured 👇👇');
    console.error(error?.toJSON());
  }

  return res.status(error.statusCode).json(error.toJSON());
};
