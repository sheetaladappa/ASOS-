# ASOS Upstream Supply

Next.js 14 + Prisma app with:
- SKU Catalog
- Smart Purchase Order Creator
- Basic Inbound Tracker

## Deploy (Vercel)
1. Provision a Postgres database (Neon/Supabase/Railway/etc.).
2. In Vercel Project → Settings → Environment Variables set:
   - `DATABASE_URL` = `postgresql://USER:PASSWORD@HOST:PORT/DBNAME?schema=public`
3. Build command is already set to: `prisma generate && next build`.

## Local
- Create `.env` with `DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DBNAME?schema=public`
- `npm i`
- `npx prisma migrate dev --name init`
- `npm run dev`
