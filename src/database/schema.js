import { pgTable, timestamp, varchar, integer, text, index } from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    firstName: varchar('first_name', { length: 50 }).notNull(),
    lastName: varchar('last_name', { length: 50 }).notNull(),
    email: varchar('email', { length: 128 }).unique().notNull(),
    password: text('password').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (self) => {
    emailIdx: index('users_email_idx').on(self.email);
  },
);

export const tokenBlacklist = pgTable(
  'token_blacklist',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    token: text('token').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (self) => {
    tokenIdx: index('token_idx').on(self.token);
    tokenCreatedAtIdx: index('token_created_at_idx').on(self.token, self.createdAt);
  },
);
