# PLM SaaS MVP (Next.js + Supabase)

This repository contains a working MVP of a multi-tenant Product Lifecycle Management platform built from `ProductLifecycleManagement.md` and `AI_INSTRUCTIONS.md`.

## Stack

- Frontend: Next.js App Router, React, TypeScript, TailwindCSS
- Backend: Next.js API routes (REST)
- Database: Supabase PostgreSQL
- Auth: Supabase Auth
- Storage: Supabase Storage (`documents`, `cad-files`)
- Deployment: Vercel-compatible

No paid third-party APIs are used.

## Project Structure

- `app/` Next.js App Router UI + API routes
- `components/` reusable UI components
- `lib/` clients, env, auth/session, validation helpers
- `services/` business logic for auth and CRUD handlers
- `api/` API documentation placeholder
- `database/` SQL schema and seed scripts
- `supabase/` storage bucket and policy setup
- `types/` shared TS types
- `utils/` app-wide constants

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables using `.env.example`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

3. In Supabase SQL editor, run:

- `database/schema.sql`
- `database/seed.sql`
- `supabase/storage-setup.sql`

4. Start development server:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Auth

- Signup: `/signup` (`POST /api/auth/signup`)
- Login: `/login` (`POST /api/auth/login`)
- Backward-compatible auth endpoint: `POST /api/auth` with `{ action: "login" | "signup" }`
- Session token is validated server-side via Supabase Auth (`/api/me` and protected API routes).

## Example Product API

- `GET /api/products`: list products for authenticated user's organization
- `POST /api/products`: create product for authenticated user's organization

## Vercel Deployment

1. Push repository to your Git provider.
2. Import project into Vercel.
3. Add environment variables from `.env.example` in Vercel project settings.
4. Deploy.

`vercel.json` is included and no custom build command is required.
