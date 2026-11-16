import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/supabase/server";
import { deleteShare } from "@/lib/actions/admin";
import { formatDate, formatINR } from "@/lib/format";
import { ShareForm } from "@/components/admin/ShareForm";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import type { Share } from "@/lib/types";

export default async function EditSharePage({ params }: PageProps<"/admin/shares/[id]">) {
  const supabase = await requireAdminPage();
  const { id } = await params;
  const [{ data: share }, { data: history }] = await Promise.all([
    supabase.from("shares").select("*").eq("id", id).maybeSingle(),
    supabase.from("share_price_history").select("id, price, recorded_at").eq("share_id", id).order("recorded_at", { ascending: false }).limit(10),
  ]);
  if (!share) notFound();
  const s = share as Share;

  return (
    <div>
      <Link href="/admin/shares" className="text-sm text-brand">← Shares</Link>
      <div className="mb-6 mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{s.name}</h1>
        <div className="flex gap-2">
          <Link href={`/shares/${s.slug}`} target="_blank" className="btn-outline">View public page ↗</Link>
          <form action={deleteShare.bind(null, s.id)}>
            <ConfirmButton message={`Delete ${s.name} and its price history? This cannot be undone.`}>Delete</ConfirmButton>
          </form>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
        <ShareForm share={s} />
        <section className="card h-fit p-4">
          <h2 className="mb-2 font-semibold">Recent price entries</h2>
          <ul className="space-y-1 text-sm">
            {(history ?? []).map((h) => (
              <li key={h.id} className="flex justify-between">
                <span className="text-muted">{formatDate(h.recorded_at)}</span>
                <span>{formatINR(Number(h.price))}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
