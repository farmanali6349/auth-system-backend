import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { DATABASE_URL } from './src/config/config.js';

export default defineConfig({
  out: './drizzle/',
  schema: './src/database/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: DATABASE_URL,
  },
});
