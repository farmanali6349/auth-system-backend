import { IS_DEV } from '../config/config.js';

export class ApiError extends Error {
  constructor(statusCode, message, data = null, errors = [], stack = '') {
    super(message);

    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.data = data;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      success: this.success,
      message: this.message,
      data: this.data,
      ...(IS_DEV ? { errors: this.errors, stack: this.stack } : {}),
    };
  }

  // Bad Request
  static badRequest(message = 'Bad Request', errors = []) {
    return new ApiError(400, message, errors);
  }

  // Unathorized
  static unAuthorized(message = 'Unauthorized', errors = []) {
    return new ApiError(401, message, errors);
  }

  // Forbidden
  static forbidden(message = 'Forbidden', errors = []) {
    return new ApiError(403, message, errors);
  }

  // Not Found
  static notFound(message = 'Not Found', errors = []) {
    return new ApiError(404, message, errors);
  }

  // Internal Server Error
  static internalServerError(message = 'Internal Server Error', errors = []) {
    return new ApiError(500, message, errors);
  }
}
