import Link from "next/link";
import { requireAdminPage } from "@/lib/supabase/server";

type Client = Awaited<ReturnType<typeof requireAdminPage>>;

async function getCounts(supabase: Client) {
  const since = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
  return Promise.all([
    supabase.from("shares").select("*", { count: "exact", head: true }),
    supabase.from("articles").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("*", { count: "exact", head: true }).gte("created_at", since),
  ]);
}

export default async function AdminDashboard() {
  const supabase = await requireAdminPage();
  const [shares, articles, leads, recent] = await getCounts(supabase);

  const tiles = [
    { label: "Shares", value: shares.count ?? 0, href: "/admin/shares" },
    { label: "Articles", value: articles.count ?? 0, href: "/admin/articles" },
    { label: "Total leads", value: leads.count ?? 0, href: "/admin/leads" },
    { label: "Leads (last 7 days)", value: recent.count ?? 0, href: "/admin/leads" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.label} href={t.href} className="card p-5 hover:shadow-md">
            <p className="text-sm text-muted">{t.label}</p>
            <p className="mt-1 text-3xl font-bold text-brand">{t.value}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/shares/new" className="btn-primary">+ New share</Link>
        <Link href="/admin/articles/new" className="btn-outline">+ New article</Link>
        <Link href="/admin/exhibition-kit" className="btn-outline">Exhibition QR code</Link>
      </div>
    </div>
  );
}
