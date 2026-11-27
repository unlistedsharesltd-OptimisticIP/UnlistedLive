# Deploying on Netlify (+ email alerts and analytics)

## 1. Supabase (one time)

1. Supabase dashboard → your project → **SQL Editor** → paste and run `supabase/schema.sql`, then `supabase/seed.sql`.
2. **Authentication → Sign In / Providers** → turn off **Allow new users to sign up**.
3. **Authentication → Users → Add user** → enter the admin email + password (tick *Auto confirm*).
4. SQL Editor:
   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'admin@yourdomain.com';
   ```
5. **Project Settings → API**: copy the **Project URL** and the **anon / publishable key** for step 2.

## 2. Netlify

1. https://app.netlify.com → **Add new project → Import an existing project → GitHub** → authorise the GitHub account that holds this repo → pick the repo.
2. Build settings are read from `netlify.toml` (build `npm run build`, publish `.next`, Node 22). Leave them as shown.
3. Before deploying, open **Environment variables → Add a variable** and add:

   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://<your-site>.netlify.app` (or your custom domain) |
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon / publishable key |
   | `RESEND_API_KEY` | see section 3 |
   | `RESEND_FROM_EMAIL` | see section 3 |
   | `ADMIN_NOTIFICATION_EMAIL` | inbox that should receive enquiries |
   | `NEXT_PUBLIC_WHATSAPP_NUMBER` | e.g. `919876543210` (digits only, with country code) |
   | `NEXT_PUBLIC_WHATSAPP_MESSAGE` | optional pre-filled message |
   | `NEXT_PUBLIC_GA_ID` | see section 4 |

   Leave `NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS` unset — Vercel Analytics only works on Vercel.
4. **Deploy**. Every push to `main` redeploys automatically.
5. **Custom domain** (optional): **Domain management → Add a domain**, follow the DNS instructions, then update `NEXT_PUBLIC_SITE_URL` and **redeploy** (`NEXT_PUBLIC_*` values are baked in at build time).
6. Supabase → **Authentication → URL Configuration** → set **Site URL** to the same live URL.

## 3. Enquiry emails (Resend)

Every enquiry is saved to the `leads` table first, then emailed to `ADMIN_NOTIFICATION_EMAIL`. If email fails, the lead is still saved and visible in `/admin/leads`.

1. Sign up at https://resend.com → **API Keys → Create API key** (permission: *Sending access*) → copy it into `RESEND_API_KEY`.
2. Pick a sender:
   - **Quick test (no domain needed):** `RESEND_FROM_EMAIL=Optimistic IP <onboarding@resend.dev>`. Resend only delivers this to the email address you signed up to Resend with, so set `ADMIN_NOTIFICATION_EMAIL` to that address.
   - **Production:** Resend → **Domains → Add domain** (e.g. `optimisticip.com`) → add the DNS records it shows (SPF/DKIM) at your domain registrar → wait for *Verified* → set `RESEND_FROM_EMAIL=Optimistic IP <leads@optimisticip.com>`. You can then send to any inbox.
3. Redeploy on Netlify after changing the variables.
4. Test: submit the Contact form on the live site → check the inbox (and spam) and `/admin/leads`.

If no email arrives: Netlify → **Logs → Functions** shows `Lead email failed …` with Resend's reason; Resend → **Logs** shows each send attempt.

## 4. Visitor analytics

**Google Analytics 4 (free, already built in):**

1. https://analytics.google.com → **Admin → Create → Property** → add a **Web** data stream with your live URL.
2. Copy the **Measurement ID** (`G-XXXXXXXXXX`) into Netlify as `NEXT_PUBLIC_GA_ID` → redeploy.
3. Check **Reports → Realtime** while you browse the site.
4. Useful reports: *Acquisition → Traffic acquisition* (where visitors come from), *Engagement → Pages and screens* (most-viewed shares). Visitors from the exhibition QR arrive with `?source=moneycontrol-expo` in the URL.

**Netlify built-in analytics (optional, paid add-on):** Netlify project → **Analytics** / **Observability**. Server-side page views, no code or cookie banner needed, but fewer details than GA4.

**Lead attribution (already built in):** `/admin/leads` and the CSV export show the `source` of every enquiry (e.g. `moneycontrol-expo`), so you can count which channel produced actual leads, not just visits.
