import { drizzle } from 'drizzle-orm/node-postgres';
import { DATABASE_URL } from '../config/config';

export const db = drizzle(DATABASE_URL);
console.log('Database client initialized');
