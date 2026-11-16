import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/supabase/server";
import { deleteArticle } from "@/lib/actions/admin";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import type { Article } from "@/lib/types";

export default async function EditArticlePage({ params }: PageProps<"/admin/articles/[id]">) {
  const supabase = await requireAdminPage();
  const { id } = await params;
  const { data } = await supabase.from("articles").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const article = data as Article;

  return (
    <div>
      <Link href="/admin/articles" className="text-sm text-brand">← Knowledge Centre</Link>
      <div className="mb-6 mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{article.title}</h1>
        <div className="flex gap-2">
          {article.published && (
            <Link href={`/knowledge-centre/${article.slug}`} target="_blank" className="btn-outline">View ↗</Link>
          )}
          <form action={deleteArticle.bind(null, article.id)}>
            <ConfirmButton message={`Delete "${article.title}"? This cannot be undone.`}>Delete</ConfirmButton>
          </form>
        </div>
      </div>
      <ArticleForm article={article} />
    </div>
  );
}
