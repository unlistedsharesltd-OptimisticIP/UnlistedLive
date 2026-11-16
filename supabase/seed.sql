-- Sample data so the UI and price charts can be verified immediately.
-- Companies below are FICTIONAL placeholders. Replace with client data via
-- Admin → Shares → Bulk Import (or delete these rows) before launch.
-- Run after schema.sql. Safe to re-run.

insert into public.shares
  (name, slug, isin, sector, drhp_status, lot_size, indicative_price, featured, overview, financials, shareholding)
values
  ('Sample Fintech Ltd', 'sample-fintech', 'INE000S01011', 'Financial Services', 'filed', 100, 845.00, true,
   'Sample Fintech Ltd is a placeholder digital payments and lending company used for demonstration. It operates a merchant payments network and a small-ticket credit book across India.',
   '[{"label":"Revenue (FY25)","value":"₹1,240 Cr"},{"label":"EBITDA (FY25)","value":"₹210 Cr"},{"label":"PAT (FY25)","value":"₹96 Cr"},{"label":"Market Cap (indicative)","value":"₹9,800 Cr"},{"label":"P/E (indicative)","value":"102x"}]',
   '[{"category":"Promoters","percent":48.5},{"category":"Institutional","percent":36.0},{"category":"ESOP / Employees","percent":7.5},{"category":"Public / Others","percent":8.0}]'),
  ('Sample Energy Ltd', 'sample-energy', 'INE000S02019', 'Energy', 'approved', 250, 312.50, true,
   'Sample Energy Ltd is a placeholder renewable energy developer with solar and wind assets. Figures are illustrative only.',
   '[{"label":"Revenue (FY25)","value":"₹3,450 Cr"},{"label":"EBITDA (FY25)","value":"₹1,020 Cr"},{"label":"PAT (FY25)","value":"₹288 Cr"},{"label":"Market Cap (indicative)","value":"₹14,500 Cr"}]',
   '[{"category":"Promoters","percent":62.0},{"category":"Institutional","percent":24.0},{"category":"ESOP / Employees","percent":3.0},{"category":"Public / Others","percent":11.0}]'),
  ('Sample Consumer Tech Ltd', 'sample-consumer-tech', 'INE000S03017', 'Consumer Technology', 'not_filed', 50, 1520.00, true,
   'Sample Consumer Tech Ltd is a placeholder direct-to-consumer brand platform. Figures are illustrative only.',
   '[{"label":"Revenue (FY25)","value":"₹780 Cr"},{"label":"EBITDA (FY25)","value":"-₹45 Cr"},{"label":"PAT (FY25)","value":"-₹82 Cr"},{"label":"Last Funding Valuation","value":"₹6,200 Cr"}]',
   '[{"category":"Founders","percent":31.0},{"category":"Institutional","percent":55.0},{"category":"ESOP / Employees","percent":9.0},{"category":"Others","percent":5.0}]')
on conflict (slug) do nothing;

-- Backfill 12 months of illustrative indicative prices (the insert trigger
-- already logged today's price). Skips shares that already have history.
insert into public.share_price_history (share_id, price, recorded_at)
select s.id,
       round((s.indicative_price * (0.72 + 0.28 * (m::numeric / 12)) * (1 + 0.04 * sin(m)))::numeric, 2),
       date_trunc('month', now()) - make_interval(months => 12 - m)
from public.shares s
cross join generate_series(0, 11) as m
where s.slug in ('sample-fintech', 'sample-energy', 'sample-consumer-tech')
  and (select count(*) from public.share_price_history h where h.share_id = s.id) <= 1;

insert into public.articles (title, slug, excerpt, content, published, published_at)
values (
  'What are unlisted shares?',
  'what-are-unlisted-shares',
  'A short primer on unlisted and pre-IPO shares, how they are priced, and the risks involved.',
  E'## Unlisted shares, explained\n\nUnlisted shares are shares of companies that are **not traded on a recognised stock exchange** such as NSE or BSE.\n\n### How are they priced?\n\nPrices are *indicative* and discovered through negotiated deals between buyers and sellers. They can differ significantly from any future listing price.\n\n### Key risks\n\n- **Liquidity risk** — there may be no buyer when you want to sell.\n- **Information risk** — disclosures are more limited than for listed companies.\n- **Lock-in** — shares bought before an IPO are usually locked in for 6 months after listing.\n\n> This article is for education only and is not investment advice.',
  true,
  now()
)
on conflict (slug) do nothing;
