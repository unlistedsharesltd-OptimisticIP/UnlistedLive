-- Optimistic IP — Unlisted Shares Platform (Phase 1)
-- Run once in the Supabase SQL editor (or `supabase db push`). Safe to re-run.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Admins: only auth users listed here can write via the CMS (enforced by RLS).
-- Add an admin after creating the user in Supabase Auth:
--   insert into public.admin_users (user_id)
--   select id from auth.users where email = 'admin@example.com';
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- Shares
-- financials:   [{ "label": "Revenue (FY25)", "value": "₹1,200 Cr" }, ...]
-- shareholding: [{ "category": "Promoters", "percent": 54.2 }, ...]
-- ---------------------------------------------------------------------------
create table if not exists public.shares (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  isin text unique,
  sector text not null,
  drhp_status text not null default 'not_filed'
    check (drhp_status in ('not_filed', 'filed', 'approved')),
  lot_size integer not null default 1 check (lot_size > 0),
  indicative_price numeric(14, 2) not null check (indicative_price >= 0),
  logo_url text,
  featured boolean not null default false,
  overview text not null default '',
  financials jsonb not null default '[]'::jsonb,
  shareholding jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.share_price_history (
  id bigint generated always as identity primary key,
  share_id uuid not null references public.shares (id) on delete cascade,
  price numeric(14, 2) not null check (price >= 0),
  recorded_at timestamptz not null default now()
);

create index if not exists share_price_history_share_idx
  on public.share_price_history (share_id, recorded_at);

-- ---------------------------------------------------------------------------
-- Knowledge Centre articles (content is Markdown)
-- ---------------------------------------------------------------------------
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content text not null default '',
  cover_image_url text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Leads (share enquiries, sell-ESOP enquiries, contact form)
-- ---------------------------------------------------------------------------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  enquiry_type text not null
    check (enquiry_type in ('share_enquiry', 'sell_esop', 'contact')),
  name text not null,
  phone text not null,
  email text,
  share_id uuid references public.shares (id) on delete set null,
  company_name text,
  quantity text,
  message text,
  source text,       -- e.g. ?source=moneycontrol-expo or utm_source
  page_path text
);

create index if not exists leads_created_idx on public.leads (created_at desc);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists shares_updated_at on public.shares;
create trigger shares_updated_at before update on public.shares
  for each row execute function public.set_updated_at();

drop trigger if exists articles_updated_at on public.articles;
create trigger articles_updated_at before update on public.articles
  for each row execute function public.set_updated_at();

-- Every new/changed indicative price is appended to the price history,
-- so the public chart updates without any extra app code.
create or replace function public.log_share_price()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' or new.indicative_price is distinct from old.indicative_price then
    insert into public.share_price_history (share_id, price)
    values (new.id, new.indicative_price);
  end if;
  return new;
end;
$$;

drop trigger if exists shares_log_price on public.shares;
create trigger shares_log_price after insert or update of indicative_price on public.shares
  for each row execute function public.log_share_price();

-- ---------------------------------------------------------------------------
-- Table privileges for the API roles. Newer Supabase projects do not grant
-- these automatically; RLS policies below still decide which rows each role
-- can actually see or change.
-- ---------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select on public.shares, public.share_price_history, public.articles to anon;
grant insert on public.leads to anon;
grant select, insert, update, delete on public.shares, public.share_price_history, public.articles to authenticated;
grant select, insert, delete on public.leads to authenticated;
grant select on public.admin_users to authenticated;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.admin_users enable row level security;
alter table public.shares enable row level security;
alter table public.share_price_history enable row level security;
alter table public.articles enable row level security;
alter table public.leads enable row level security;

-- admin_users: admins can see the list; managed via SQL only.
drop policy if exists "admins read admin_users" on public.admin_users;
create policy "admins read admin_users" on public.admin_users
  for select to authenticated using (public.is_admin());

-- shares: public read, admin write
drop policy if exists "public read shares" on public.shares;
create policy "public read shares" on public.shares
  for select to anon, authenticated using (true);
drop policy if exists "admin write shares" on public.shares;
create policy "admin write shares" on public.shares
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- price history: public read, admin write (trigger inserts as definer)
drop policy if exists "public read price history" on public.share_price_history;
create policy "public read price history" on public.share_price_history
  for select to anon, authenticated using (true);
drop policy if exists "admin write price history" on public.share_price_history;
create policy "admin write price history" on public.share_price_history
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- articles: public reads published only, admin full access
drop policy if exists "public read published articles" on public.articles;
create policy "public read published articles" on public.articles
  for select to anon, authenticated using (published or public.is_admin());
drop policy if exists "admin write articles" on public.articles;
create policy "admin write articles" on public.articles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- leads: anyone may submit (insert only), only admins can read/delete
drop policy if exists "public insert leads" on public.leads;
create policy "public insert leads" on public.leads
  for insert to anon, authenticated with check (true);
drop policy if exists "admin read leads" on public.leads;
create policy "admin read leads" on public.leads
  for select to authenticated using (public.is_admin());
drop policy if exists "admin delete leads" on public.leads;
create policy "admin delete leads" on public.leads
  for delete to authenticated using (public.is_admin());
