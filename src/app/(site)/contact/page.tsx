import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { LeadForm } from "@/components/forms/LeadForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${siteConfig.name} about unlisted shares, pre-IPO investing or selling ESOPs.`,
};

export default function ContactPage() {
  const { office } = siteConfig;
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Contact us</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_420px]">
        <div className="card space-y-4 p-5">
          <div>
            <h2 className="text-sm font-semibold text-muted">Office</h2>
            <p>{office.address}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-muted">Phone</h2>
            <a href={`tel:${office.phone.replace(/\s/g, "")}`} className="text-brand">{office.phone}</a>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-muted">Email</h2>
            <a href={`mailto:${office.email}`} className="text-brand">{office.email}</a>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-muted">Hours</h2>
            <p>{office.hours}</p>
          </div>
        </div>
        <LeadForm enquiryType="contact" title="Send us a message" submitLabel="Send message" />
      </div>
    </div>
  );
}
