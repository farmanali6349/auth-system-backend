import { pgTable, timestamp, varchar, integer, text, index, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    firstName: varchar('first_name', { length: 50 }).notNull(),
    lastName: varchar('last_name', { length: 50 }).notNull(),
    email: varchar('email', { length: 128 }).unique().notNull(),
    password: text('password').notNull(),
    isVerified: boolean('is_verified').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (self) => ({
    emailIdx: index('users_email_idx').on(self.email),
  }),
);

export const tokenBlacklist = pgTable(
  'token_blacklist',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    token: text('token').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (self) => ({
    tokenIdx: index('token_idx').on(self.token),
    tokenCreatedAtIdx: index('token_created_at_idx').on(self.token, self.createdAt),
  }),
);

export const sessions = pgTable(
  'sessions',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: integer('user_id').notNull(),
    refreshToken: text('refresh_token').notNull(),
    ip: text('ip').notNull(),
    userAgent: text('user_agent'),
    revoked: boolean('revoked').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (self) => ({
    refreshTokenIdx: index('refresh_token_idx').on(self.refreshToken),
  }),
);

export const otpVerification = pgTable('otp_verification', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  email: varchar('email', { length: 128 }).notNull(),
  otp: integer('otp').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
});
