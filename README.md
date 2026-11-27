# Optimistic IP — Unlisted Shares Platform (Phase 1)

Ref: QT-NES-2610 · Target: Moneycontrol Exhibition, 25–26 Nov 2026

Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind v4 · Supabase (Postgres + Auth) · Resend · Vercel

## Setup

1. **Supabase project** → SQL editor → run `supabase/schema.sql`, then `supabase/seed.sql` (3 fictional sample shares with 12 months of price history + 1 article).
2. **Disable public sign-ups**: Authentication → Sign In / Providers → turn off "Allow new users to sign up" (admin access is also restricted by `admin_users`, below).
3. **Create an admin**: Authentication → Users → *Add user* (email + password), then in the SQL editor:
   ```sql
   insert into public.admin_users (user_id) select id from auth.users where email = 'admin@example.com';
   ```
4. **Env vars**: copy `.env.example` → `.env.local` and fill in. Add the same keys in Vercel.
5. Run locally:
   ```bash
   npm install
   npm run dev
   ```

## Deploy on Netlify

See [docs/deploy-netlify.md](docs/deploy-netlify.md) for Netlify hosting, enquiry email (Resend) setup and visitor analytics.

## Deploy (GitHub + Vercel)

Push to GitHub, import the repo in Vercel, add the env vars from `.env.example`, deploy. Set `NEXT_PUBLIC_SITE_URL` to the live domain **before** generating the exhibition QR code. For lead emails, verify your sending domain in Resend and use it in `RESEND_FROM_EMAIL`.

## Where things live

| What | Where |
|---|---|
| Brand colours | `src/app/globals.css` (`:root` variables) |
| Logo (placeholder) | `src/components/site/Logo.tsx` |
| Home stats, "How it works", office details, nav, compliance text | `src/config/site.ts` |
| DB schema, RLS, price-history trigger | `supabase/schema.sql` |
| Public data reads (cached, tag-invalidated) | `src/lib/data.ts` |
| Lead capture + email alert | `src/lib/actions/leads.ts` |
| CMS server actions | `src/lib/actions/admin.ts` |
| Bulk import template | `supabase/sample-shares.csv` |

## Admin CMS (`/admin`)

- **Shares**: create / edit / delete. Saving a new indicative price automatically appends a dated row to `share_price_history` (DB trigger), which drives the public chart.
- **Bulk Import**: upload or paste CSV/JSON; all rows are validated before anything is saved; rows with an existing slug are updated.
- **Knowledge Centre**: Markdown articles with publish/unpublish.
- **Leads**: all enquiries, newest first, with CSV export.
- **Exhibition Kit**: QR code (PNG 2048px / SVG) to any landing page with `?source=moneycontrol-expo` (editable). The source tag is remembered for the visitor's session and stored on each lead.

## Caching

Public pages are served from cache and refreshed when an admin saves (`updateTag`), with a few-minute fallback refresh. Admin pages are always live.

## Before launch — client inputs needed

- Brand colours, logo, real share data (via Bulk Import), home-page stats, office details, WhatsApp number.
- **Legal review of `/disclaimer` and `/privacy-policy`** — current copy is placeholder.
- Delete the fictional sample shares (or overwrite them via import).
