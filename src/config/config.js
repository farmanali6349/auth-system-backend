import 'dotenv/config.js';

const required = (name) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is missing`);
  }

  return value;
};

export const isDev = process.env.NODE_ENV !== 'production';

export const PORT = required('PORT');
export const DATABASE_URL = required('DATABASE_URL');
export const JWT_SECRET = required('JWT_SECRET');
export const JWT_EXPIRES_IN = process.env.JWT || '1d';
export const CORS_ORIGIN = process.env.CORS_ORIGIN || (isDev ? 'http//localhost:4000' : '*');
