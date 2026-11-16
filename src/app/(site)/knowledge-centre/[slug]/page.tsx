import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getArticleBySlug } from "@/lib/data";
import { formatDate } from "@/lib/format";

export async function generateMetadata({ params }: PageProps<"/knowledge-centre/[slug]">): Promise<Metadata> {
  const article = await getArticleBySlug((await params).slug);
  if (!article) return { title: "Article not found" };
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/knowledge-centre/${article.slug}` },
    openGraph: { type: "article", title: article.title, description: article.excerpt },
  };
}

export default function ArticlePage({ params }: PageProps<"/knowledge-centre/[slug]">) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/knowledge-centre" className="text-sm font-medium text-brand">← Knowledge Centre</Link>
      <Suspense fallback={<p className="py-20 text-center text-muted">Loading…</p>}>
        {params.then(({ slug }) => <ArticleBody slug={slug} />)}
      </Suspense>
    </div>
  );
}

async function ArticleBody({ slug }: { slug: string }) {
  const article = await getArticleBySlug(slug);
  if (!article) notFound();
  return (
    <article className="mt-4">
      <h1 className="text-3xl font-bold leading-tight">{article.title}</h1>
      {article.published_at && <p className="mt-2 text-sm text-muted">{formatDate(article.published_at)}</p>}
      {article.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element -- cover images are arbitrary CMS URLs
        <img src={article.cover_image_url} alt="" className="mt-6 w-full rounded-xl object-cover" />
      )}
      <div className="prose prose-slate mt-6 max-w-none prose-a:text-brand">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
      </div>
    </article>
  );
}
