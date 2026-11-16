import { cacheLife, cacheTag } from "next/cache";
import { getPublicClient } from "./supabase/public";
import type { Article, PricePoint, Share } from "./types";

// Public, cached reads. CMS server actions call updateTag("shares"/"articles")
// so edits show immediately; cacheLife is a backstop.

function client() {
  const supabase = getPublicClient();
  if (!supabase) console.warn("Supabase env vars missing — public pages render without data.");
  return supabase;
}

export async function getShares(): Promise<Share[]> {
  "use cache";
  cacheTag("shares");
  cacheLife("minutes");
  const supabase = client();
  if (!supabase) return [];
  const { data, error } = await supabase.from("shares").select("*").order("name");
  if (error) throw error;
  return data as Share[];
}

export async function getShareBySlug(slug: string): Promise<Share | null> {
  "use cache";
  cacheTag("shares");
  cacheLife("minutes");
  const supabase = client();
  if (!supabase) return null;
  const { data, error } = await supabase.from("shares").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data as Share | null;
}

export async function getPriceHistory(shareId: string): Promise<PricePoint[]> {
  "use cache";
  cacheTag("shares");
  cacheLife("minutes");
  const supabase = client();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("share_price_history")
    .select("price, recorded_at")
    .eq("share_id", shareId)
    .order("recorded_at");
  if (error) throw error;
  return (data ?? []).map((p) => ({ price: Number(p.price), recorded_at: p.recorded_at }));
}

export async function getPublishedArticles(): Promise<Article[]> {
  "use cache";
  cacheTag("articles");
  cacheLife("minutes");
  const supabase = client();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (error) throw error;
  return data as Article[];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  "use cache";
  cacheTag("articles");
  cacheLife("minutes");
  const supabase = client();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  return data as Article | null;
}
