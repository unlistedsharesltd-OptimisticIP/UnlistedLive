import { slugify } from "./format";
import type { DrhpStatus, FinancialItem, ShareholdingItem } from "./types";

export type ShareInput = {
  name: string;
  slug: string;
  isin: string | null;
  sector: string;
  drhp_status: DrhpStatus;
  lot_size: number;
  indicative_price: number;
  logo_url: string | null;
  featured: boolean;
  overview: string;
  financials: FinancialItem[];
  shareholding: ShareholdingItem[];
};

const DRHP: DrhpStatus[] = ["not_filed", "filed", "approved"];

const str = (v: unknown) => (v == null ? "" : String(v).trim());

function parseJsonArray(v: unknown): unknown[] {
  if (Array.isArray(v)) return v;
  const s = str(v);
  if (!s) return [];
  const parsed = JSON.parse(s);
  if (!Array.isArray(parsed)) throw new Error("must be a JSON array");
  return parsed;
}

/**
 * Validates one share from the CMS form or a CSV/JSON import row.
 * Returns either the clean input or a human-readable error.
 */
export function parseShareInput(raw: Record<string, unknown>): { data: ShareInput } | { error: string } {
  const name = str(raw.name);
  if (!name) return { error: "Name is required" };
  const slug = slugify(str(raw.slug) || name);
  const sector = str(raw.sector);
  if (!sector) return { error: `${name}: sector is required` };

  // Accepts "filed", "DRHP Filed", "Not Filed", "not_filed", etc.
  const drhpRaw = str(raw.drhp_status).toLowerCase().replace(/[\s-]+/g, "_").replace(/^drhp_/, "") || "not_filed";
  if (!DRHP.includes(drhpRaw as DrhpStatus)) return { error: `${name}: drhp_status must be one of ${DRHP.join(", ")}` };

  const lot = Number(str(raw.lot_size) || 1);
  if (!Number.isInteger(lot) || lot < 1) return { error: `${name}: lot_size must be a whole number ≥ 1` };

  const price = Number(str(raw.indicative_price).replace(/[₹,\s]/g, ""));
  if (!Number.isFinite(price) || price < 0 || str(raw.indicative_price) === "")
    return { error: `${name}: indicative_price must be a number` };

  let financials: FinancialItem[];
  let shareholding: ShareholdingItem[];
  try {
    financials = parseJsonArray(raw.financials)
      .map((f) => ({ label: str((f as FinancialItem).label), value: str((f as FinancialItem).value) }))
      .filter((f) => f.label);
  } catch {
    return { error: `${name}: financials must be a JSON array of {label, value}` };
  }
  try {
    shareholding = parseJsonArray(raw.shareholding)
      .map((h) => ({ category: str((h as ShareholdingItem).category), percent: Number((h as ShareholdingItem).percent) }))
      .filter((h) => h.category && Number.isFinite(h.percent));
  } catch {
    return { error: `${name}: shareholding must be a JSON array of {category, percent}` };
  }

  const featuredRaw = raw.featured;
  const featured = featuredRaw === true || ["true", "yes", "1", "on"].includes(str(featuredRaw).toLowerCase());

  return {
    data: {
      name,
      slug,
      isin: str(raw.isin).toUpperCase() || null,
      sector,
      drhp_status: drhpRaw as DrhpStatus,
      lot_size: lot,
      indicative_price: Math.round(price * 100) / 100,
      logo_url: str(raw.logo_url) || null,
      featured,
      overview: str(raw.overview),
      financials,
      shareholding,
    },
  };
}
