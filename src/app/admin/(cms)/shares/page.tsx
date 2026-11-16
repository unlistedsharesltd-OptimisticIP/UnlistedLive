import Link from "next/link";
import { requireAdminPage } from "@/lib/supabase/server";
import { drhpLabel, formatDate, formatINR } from "@/lib/format";
import type { Share } from "@/lib/types";

export default async function AdminSharesPage() {
  const supabase = await requireAdminPage();
  const { data, error } = await supabase.from("shares").select("*").order("name");
  if (error) throw error;
  const shares = data as Share[];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Shares ({shares.length})</h1>
        <div className="flex gap-2">
          <Link href="/admin/shares/import" className="btn-outline">Bulk import</Link>
          <Link href="/admin/shares/new" className="btn-primary">+ New share</Link>
        </div>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Sector</th>
              <th className="p-3 font-medium">DRHP</th>
              <th className="p-3 text-right font-medium">Price</th>
              <th className="p-3 font-medium">Featured</th>
              <th className="p-3 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {shares.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0 hover:bg-background">
                <td className="p-3">
                  <Link href={`/admin/shares/${s.id}`} className="font-semibold text-brand">{s.name}</Link>
                </td>
                <td className="p-3">{s.sector}</td>
                <td className="p-3">{drhpLabel(s.drhp_status)}</td>
                <td className="p-3 text-right">{formatINR(s.indicative_price)}</td>
                <td className="p-3">{s.featured ? "Yes" : "—"}</td>
                <td className="p-3 text-muted">{formatDate(s.updated_at)}</td>
              </tr>
            ))}
            {shares.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-muted">No shares yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
