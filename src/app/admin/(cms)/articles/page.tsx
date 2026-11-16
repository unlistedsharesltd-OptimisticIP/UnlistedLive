import Link from "next/link";
import { requireAdminPage } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import type { Article } from "@/lib/types";

export default async function AdminArticlesPage() {
  const supabase = await requireAdminPage();
  const { data, error } = await supabase.from("articles").select("*").order("updated_at", { ascending: false });
  if (error) throw error;
  const articles = data as Article[];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Knowledge Centre ({articles.length})</h1>
        <Link href="/admin/articles/new" className="btn-primary">+ New article</Link>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="p-3 font-medium">Title</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id} className="border-b border-border last:border-0 hover:bg-background">
                <td className="p-3">
                  <Link href={`/admin/articles/${a.id}`} className="font-semibold text-brand">{a.title}</Link>
                </td>
                <td className="p-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${a.published ? "bg-accent/10 text-accent-dark" : "bg-slate-100 text-muted"}`}>
                    {a.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="p-3 text-muted">{formatDate(a.updated_at)}</td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr><td colSpan={3} className="p-6 text-center text-muted">No articles yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
