import Link from "next/link";
import { requireAdminPage } from "@/lib/supabase/server";
import { ImportForm } from "@/components/admin/ImportForm";

const columns = [
  ["name", "Required"],
  ["slug", "Optional — generated from name. Existing slugs are updated."],
  ["isin", "Optional"],
  ["sector", "Required"],
  ["drhp_status", "not_filed | filed | approved"],
  ["lot_size", "Whole number, default 1"],
  ["indicative_price", "Required, number in ₹"],
  ["featured", "true / false"],
  ["logo_url", "Optional"],
  ["overview", "Optional text"],
  ["financials", 'JSON, e.g. [{"label":"Revenue (FY25)","value":"₹900 Cr"}]'],
  ["shareholding", 'JSON, e.g. [{"category":"Promoters","percent":60}]'],
];

export default async function ImportPage() {
  await requireAdminPage();
  return (
    <div>
      <Link href="/admin/shares" className="text-sm text-brand">← Shares</Link>
      <h1 className="mb-2 mt-2 text-2xl font-bold">Bulk import shares</h1>
      <p className="mb-6 max-w-3xl text-sm text-muted">
        Import a CSV (header row required) or a JSON array. All rows are validated first — nothing is saved if any row
        has an error. A template is in the repository at <code>supabase/sample-shares.csv</code>.
      </p>
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <ImportForm />
        <div className="card h-fit p-4 text-sm">
          <h2 className="mb-2 font-semibold">Columns</h2>
          <dl className="space-y-1">
            {columns.map(([c, d]) => (
              <div key={c}>
                <dt className="inline font-mono font-semibold">{c}</dt> <dd className="inline text-muted">— {d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
