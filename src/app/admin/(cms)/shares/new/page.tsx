import Link from "next/link";
import { requireAdminPage } from "@/lib/supabase/server";
import { ShareForm } from "@/components/admin/ShareForm";

export default async function NewSharePage() {
  await requireAdminPage();
  return (
    <div>
      <Link href="/admin/shares" className="text-sm text-brand">← Shares</Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold">New share</h1>
      <ShareForm />
    </div>
  );
}
