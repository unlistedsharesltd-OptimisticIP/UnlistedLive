"use server";

import { Resend } from "resend";
import { getPublicClient } from "@/lib/supabase/public";
import type { EnquiryType } from "@/lib/types";

export type LeadFormState = { ok: boolean; message: string } | null;

const ENQUIRY_TYPES: EnquiryType[] = ["share_enquiry", "sell_esop", "contact"];
const ENQUIRY_LABELS: Record<EnquiryType, string> = {
  share_enquiry: "Share enquiry / callback",
  sell_esop: "Sell ESOP enquiry",
  contact: "General contact",
};

const field = (fd: FormData, key: string, max = 500) => String(fd.get(key) ?? "").trim().slice(0, max);

export async function submitLead(_prev: LeadFormState, fd: FormData): Promise<LeadFormState> {
  // Honeypot: bots fill hidden fields; pretend success.
  if (field(fd, "website")) return { ok: true, message: "Thank you! We'll call you back shortly." };

  const enquiryType = field(fd, "enquiry_type") as EnquiryType;
  const lead = {
    enquiry_type: enquiryType,
    name: field(fd, "name", 120),
    phone: field(fd, "phone", 20),
    email: field(fd, "email", 200) || null,
    share_id: field(fd, "share_id", 36) || null,
    company_name: field(fd, "company_name", 200) || null,
    quantity: field(fd, "quantity", 50) || null,
    message: field(fd, "message", 2000) || null,
    source: field(fd, "source", 100) || null,
    page_path: field(fd, "page_path", 300) || null,
  };

  if (!ENQUIRY_TYPES.includes(enquiryType)) return { ok: false, message: "Invalid enquiry type." };
  if (!lead.name) return { ok: false, message: "Please enter your name." };
  if (!/^[+\d][\d\s-]{6,18}$/.test(lead.phone)) return { ok: false, message: "Please enter a valid phone number." };
  if (lead.email && !/^\S+@\S+\.\S+$/.test(lead.email)) return { ok: false, message: "Please enter a valid email." };

  const supabase = getPublicClient();
  if (!supabase) return { ok: false, message: "Service not configured. Please contact us by phone or WhatsApp." };

  const { error } = await supabase.from("leads").insert(lead);
  if (error) {
    console.error("Lead insert failed", error);
    return { ok: false, message: "Something went wrong. Please try again or reach us on WhatsApp." };
  }

  await notifyAdmin(lead, ENQUIRY_LABELS[enquiryType]);
  return { ok: true, message: "Thank you! Our team will call you back shortly." };
}

async function notifyAdmin(lead: Record<string, string | null>, typeLabel: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_NOTIFICATION_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    console.warn("Lead saved but email alert skipped: RESEND_API_KEY / ADMIN_NOTIFICATION_EMAIL / RESEND_FROM_EMAIL not set.");
    return;
  }

  const rows = Object.entries(lead)
    .filter(([k, v]) => v && k !== "share_id" && k !== "enquiry_type")
    .map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`)
    .join("\n");

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to,
      subject: `New lead: ${typeLabel} — ${lead.name}${lead.company_name ? ` (${lead.company_name})` : ""}`,
      text: `${typeLabel}\n\n${rows}\n\nView all leads: ${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/admin/leads`,
    });
    if (error) console.error("Lead email failed", error);
  } catch (e) {
    // The lead is already saved; never fail the visitor's submission on email errors.
    console.error("Lead email failed", e);
  }
}
