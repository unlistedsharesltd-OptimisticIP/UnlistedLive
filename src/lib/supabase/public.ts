import { createClient } from "@supabase/supabase-js";
import { getSupabaseKey, supabaseUrl } from "./config";

/**
 * Cookie-less Supabase client using the anon key. Safe inside `'use cache'`
 * functions and for public lead inserts. Returns null when Supabase is not
 * configured yet (e.g. a local build without .env.local).
 */
export function getPublicClient() {
  const key = getSupabaseKey();
  if (!key) return null;
  return createClient(supabaseUrl, key, { auth: { persistSession: false } });
}
