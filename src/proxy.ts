import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseKey, supabaseUrl } from "@/lib/supabase/config";

// Refreshes the Supabase auth session cookie for admin routes.
// Authorization itself is enforced in the admin layout, server actions and RLS.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const key = getSupabaseKey();
  if (!key) return response;

  const supabase = createServerClient(supabaseUrl, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
