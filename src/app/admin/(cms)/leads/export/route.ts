import { getAdmin } from "@/lib/supabase/server";
import type { Lead } from "@/lib/types";

const COLUMNS: (keyof Lead)[] = [
  "created_at", "enquiry_type", "name", "phone", "email", "company_name", "quantity", "message", "source", "page_path",
];

// Quote every cell; neutralise spreadsheet formulas since lead data comes from the public.
function cell(v: unknown) {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET() {
  const admin = await getAdmin();
  if (!admin) return new Response("Unauthorized", { status: 401 });

  const { data, error } = await admin.supabase.from("leads").select("*").order("created_at", { ascending: false });
  if (error) return new Response(error.message, { status: 500 });

  const csv = [COLUMNS.join(","), ...(data as Lead[]).map((l) => COLUMNS.map((c) => cell(l[c])).join(","))].join("\r\n");
  const date = new Date().toISOString().slice(0, 10);

  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="optimistic-ip-leads-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
