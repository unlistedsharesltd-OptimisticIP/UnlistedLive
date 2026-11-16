import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedArticles } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Knowledge Centre",
  description: "Guides and explainers on unlisted shares, pre-IPO investing, ESOPs and DRHPs.",
};

export default async function KnowledgeCentrePage() {
  const articles = await getPublishedArticles();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Knowledge Centre</h1>
      <p className="mb-8 mt-2 text-muted">Learn how the unlisted share market works.</p>
      {articles.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <Link key={a.id} href={`/knowledge-centre/${a.slug}`} className="card overflow-hidden transition-shadow hover:shadow-md">
              {a.cover_image_url && (
                // eslint-disable-next-line @next/next/no-img-element -- cover images are arbitrary CMS URLs
                <img src={a.cover_image_url} alt="" className="h-40 w-full object-cover" />
              )}
              <div className="p-5">
                {a.published_at && <p className="text-xs text-muted">{formatDate(a.published_at)}</p>}
                <h2 className="mt-1 font-semibold">{a.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-muted">{a.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="card p-6 text-muted">Articles are coming soon.</p>
      )}
    </div>
  );
}
