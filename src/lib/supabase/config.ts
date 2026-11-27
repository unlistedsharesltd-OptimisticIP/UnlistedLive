import "server-only";

export const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/rest\/v1\/?$/, "") ||
  "https://ijpioayqnyozljjfxqgu.supabase.co";

export function getSupabaseKey() {
  const env = process.env;
  return env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
}
