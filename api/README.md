# API Layer

Runtime route handlers live in `app/api/*` per Next.js App Router.

## Example Product Routes

- `GET /api/products`
- `POST /api/products`

Both use Supabase client from `lib/supabaseClient.ts` and require authenticated Supabase session.
