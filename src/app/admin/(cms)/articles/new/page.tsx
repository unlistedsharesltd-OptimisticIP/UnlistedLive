import Link from "next/link";
import { requireAdminPage } from "@/lib/supabase/server";
import { ArticleForm } from "@/components/admin/ArticleForm";

export default async function NewArticlePage() {
  await requireAdminPage();
  return (
    <div>
      <Link href="/admin/articles" className="text-sm text-brand">← Knowledge Centre</Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold">New article</h1>
      <ArticleForm />
    </div>
  );
}
