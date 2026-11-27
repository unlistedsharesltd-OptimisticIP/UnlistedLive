import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseKey, supabaseUrl } from "./config";

/** Cookie-based client carrying the admin's session (RLS sees auth.uid()). */
export async function getServerClient() {
  const key = getSupabaseKey();
  if (!key) throw new Error("Supabase publishable key is not configured.");
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component; proxy.ts refreshes the session instead.
        }
      },
    },
  });
}

/** Returns the signed-in admin's client, or null if not signed in / not an admin. */
export async function getAdmin() {
  const supabase = await getServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) return null;
  return { supabase, user: data.user };
}

/** For admin pages: returns the admin's Supabase client or redirects to login. */
export async function requireAdminPage() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin.supabase;
}
