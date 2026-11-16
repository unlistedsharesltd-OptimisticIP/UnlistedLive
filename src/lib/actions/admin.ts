"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getAdmin, getServerClient } from "@/lib/supabase/server";
import { parseShareInput } from "@/lib/share-input";
import { slugify } from "@/lib/format";

export type ActionState = { ok: boolean; message: string } | null;

async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin.supabase;
}

const dbError = (e: { code?: string; message: string }) =>
  e.code === "23505" ? "A record with this slug or ISIN already exists." : e.message;

// --- Auth ------------------------------------------------------------------

export async function signIn(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const supabase = await getServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(fd.get("email") ?? ""),
    password: String(fd.get("password") ?? ""),
  });
  if (error) return { ok: false, message: "Invalid email or password." };
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    await supabase.auth.signOut();
    return { ok: false, message: "This account does not have admin access." };
  }
  redirect("/admin");
}

export async function signOut() {
  const supabase = await getServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// --- Shares ----------------------------------------------------------------

export async function saveShare(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const supabase = await requireAdmin();
  const id = String(fd.get("id") ?? "");
  const parsed = parseShareInput(Object.fromEntries(fd));
  if ("error" in parsed) return { ok: false, message: parsed.error };

  // Price changes are appended to share_price_history by a DB trigger.
  const { error } = id
    ? await supabase.from("shares").update(parsed.data).eq("id", id)
    : await supabase.from("shares").insert(parsed.data);
  if (error) return { ok: false, message: dbError(error) };

  updateTag("shares");
  redirect("/admin/shares");
}

export async function deleteShare(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("shares").delete().eq("id", id);
  if (error) throw new Error(error.message);
  updateTag("shares");
  redirect("/admin/shares");
}

export type ImportResult = { ok: boolean; message: string; errors: string[] };

export async function importShares(rows: Record<string, unknown>[]): Promise<ImportResult> {
  const supabase = await requireAdmin();
  if (!Array.isArray(rows) || rows.length === 0) return { ok: false, message: "No rows found.", errors: [] };
  if (rows.length > 200) return { ok: false, message: "Import at most 200 rows at a time.", errors: [] };

  const errors: string[] = [];
  const valid = rows.flatMap((row, i) => {
    const r = parseShareInput(row);
    if ("error" in r) {
      errors.push(`Row ${i + 1}: ${r.error}`);
      return [];
    }
    return [r.data];
  });
  if (errors.length) return { ok: false, message: "Nothing imported — fix these rows and retry.", errors };

  const { error } = await supabase.from("shares").upsert(valid, { onConflict: "slug" });
  if (error) return { ok: false, message: dbError(error), errors: [] };

  updateTag("shares");
  return { ok: true, message: `Imported ${valid.length} share(s). Existing slugs were updated.`, errors: [] };
}

// --- Articles --------------------------------------------------------------

export async function saveArticle(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const supabase = await requireAdmin();
  const id = String(fd.get("id") ?? "");
  const title = String(fd.get("title") ?? "").trim();
  if (!title) return { ok: false, message: "Title is required." };
  const published = fd.get("published") === "on";
  const existingPublishedAt = String(fd.get("published_at") ?? "") || null;

  const article = {
    title,
    slug: slugify(String(fd.get("slug") ?? "") || title),
    excerpt: String(fd.get("excerpt") ?? "").trim(),
    content: String(fd.get("content") ?? ""),
    cover_image_url: String(fd.get("cover_image_url") ?? "").trim() || null,
    published,
    published_at: published ? (existingPublishedAt ?? new Date().toISOString()) : existingPublishedAt,
  };

  const { error } = id
    ? await supabase.from("articles").update(article).eq("id", id)
    : await supabase.from("articles").insert(article);
  if (error) return { ok: false, message: dbError(error) };

  updateTag("articles");
  redirect("/admin/articles");
}

export async function deleteArticle(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw new Error(error.message);
  updateTag("articles");
  redirect("/admin/articles");
}
