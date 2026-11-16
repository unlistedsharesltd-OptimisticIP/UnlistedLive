import { createClient } from "@supabase/supabase-js";

/**
 * Cookie-less Supabase client using the anon key. Safe inside `'use cache'`
 * functions and for public lead inserts. Returns null when Supabase is not
 * configured yet (e.g. a local build without .env.local).
 */
export function getPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
