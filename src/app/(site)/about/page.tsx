import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `About ${siteConfig.name} — helping investors and employees access the unlisted share market.`,
};

// Placeholder copy — replace with client-approved text.
export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">About {siteConfig.name}</h1>
      <div className="mt-6 space-y-4 text-foreground/90">
        <p>
          {siteConfig.name} helps investors discover unlisted and pre-IPO companies, and helps employees and early
          shareholders explore liquidity for their ESOPs and unlisted holdings.
        </p>
        <p>
          We publish indicative prices, key financials and shareholding information so you can make informed
          enquiries. Our team then guides you through lot sizes, timelines, transfer process and risks.
        </p>
        <p className="rounded-lg bg-warning-bg p-4 text-sm text-warning-fg">{siteConfig.complianceNotice}</p>
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/shares" className="btn-primary py-3">Browse shares</Link>
        <Link href="/contact" className="btn-outline py-3">Contact us</Link>
      </div>
    </div>
  );
}
