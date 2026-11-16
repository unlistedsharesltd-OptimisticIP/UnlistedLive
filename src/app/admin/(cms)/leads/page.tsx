import { requireAdminPage } from "@/lib/supabase/server";
import type { EnquiryType, Lead } from "@/lib/types";

const TYPE_LABEL: Record<EnquiryType, string> = {
  share_enquiry: "Share enquiry",
  sell_esop: "Sell ESOP",
  contact: "Contact",
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

export default async function LeadsPage() {
  const supabase = await requireAdminPage();
  const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(1000);
  if (error) throw error;
  const leads = data as Lead[];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Leads ({leads.length})</h1>
        {/* Plain <a>: this is a file download from a route handler, not a page. */}
        <a href="/admin/leads/export" className="btn-primary">Export all as CSV</a>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="p-3 font-medium">Received (IST)</th>
              <th className="p-3 font-medium">Type</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Phone</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Company</th>
              <th className="p-3 font-medium">Qty</th>
              <th className="p-3 font-medium">Message</th>
              <th className="p-3 font-medium">Source</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id} className="border-b border-border align-top last:border-0">
                <td className="whitespace-nowrap p-3 text-muted">{fmt(l.created_at)}</td>
                <td className="whitespace-nowrap p-3">{TYPE_LABEL[l.enquiry_type]}</td>
                <td className="p-3 font-medium">{l.name}</td>
                <td className="whitespace-nowrap p-3"><a href={`tel:${l.phone}`} className="text-brand">{l.phone}</a></td>
                <td className="p-3">{l.email ?? "—"}</td>
                <td className="p-3">{l.company_name ?? "—"}</td>
                <td className="p-3">{l.quantity ?? "—"}</td>
                <td className="max-w-xs p-3 text-muted">{l.message ?? "—"}</td>
                <td className="p-3">{l.source ?? "—"}</td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr><td colSpan={9} className="p-6 text-center text-muted">No leads yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
