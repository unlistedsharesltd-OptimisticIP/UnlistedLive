import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getPublishedArticles, getShares } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");
  const [shares, articles] = await Promise.all([getShares(), getPublishedArticles()]);

  const staticPages = ["", "/shares", "/sell-esop", "/knowledge-centre", "/about", "/contact", "/disclaimer", "/privacy-policy"];

  return [
    ...staticPages.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...shares.map((s) => ({ url: `${base}/shares/${s.slug}`, lastModified: s.updated_at, changeFrequency: "daily" as const, priority: 0.8 })),
    ...articles.map((a) => ({ url: `${base}/knowledge-centre/${a.slug}`, lastModified: a.updated_at, priority: 0.6 })),
  ];
}
