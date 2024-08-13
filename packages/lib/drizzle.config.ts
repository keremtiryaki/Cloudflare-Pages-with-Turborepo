import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: "./db/schema/*",
  out: './db/sql-migrations',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    // not-required-for-dev because migrations handled by wrangler
    accountId: "not-required-for-dev",
    databaseId: "not-required-for-dev",
    token: "not-required-for-dev",
  },
});