# Local and Remote Development Setup for Cloudflare Pages with Turborepo

- **packages/lib**
  - Shared code with shared Wrangler configurations for D1 database.
  - Drizzle with D1 database.
  - All apps are able to connect to the same local d1 database.

- **apps/api-hono**
  - Simple Hono app with esbuild.

- **apps/api-hono-2**
  - Simple Hono app with Vite.

- **apps/web-astro**
  - Simple Astro with CF adapter.

## Local Development Setup
install wrangler and login
```bash
pnpm i
pnpm local-migrate # say yes
pnpm dev
```

then open the following urls in your browser
http://localhost:3001
http://localhost:3001/add

http://localhost:3002
http://localhost:3002/add

http://localhost:3003
http://localhost:3003/add

## geenrate sql files and migrate
run the following commands to generate sql files and migrate after schema changes
```bash
pnpm gen-sql
pnpm local-migrate
```

## deploy as preview to test branch
```bash
pnpm run remote-create-db
# update packages/lib/wrangler-test-db.toml with the new db id. required for "remote-migrate" command for D1 database
pnpm remote-migrate
pnpm run deploy # ssl may take a while to be issued
# set your preview d1 binding with dashboard by opening deployed apps and checking their settings->functions->D1 database bindings->preview
# D1_DB -> test-d1-db
```