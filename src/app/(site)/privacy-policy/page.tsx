import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects and uses your information.`,
};

// Placeholder legal copy — must be reviewed by the client's legal/compliance team before launch.
export default function PrivacyPolicyPage() {
  return (
    <div className="prose prose-slate mx-auto max-w-3xl px-4 py-10">
      <h1>Privacy Policy</h1>
      <div className="not-prose rounded-xl border-2 border-warning-fg/30 bg-warning-bg p-5 text-sm text-warning-fg">
        {siteConfig.complianceNotice}
      </div>
      <h2>Information we collect</h2>
      <p>
        When you submit an enquiry, we collect the details you provide: name, phone number, email address, the company
        or share you are interested in, quantity and any message. We also record the page and campaign source (for
        example, an exhibition QR code) that led to your enquiry.
      </p>
      <h2>How we use it</h2>
      <p>
        We use this information only to respond to your enquiry, contact you about it, and improve our services. We do
        not sell your personal information.
      </p>
      <h2>Analytics</h2>
      <p>We may use privacy-friendly analytics to understand aggregate website usage.</p>
      <h2>Your choices</h2>
      <p>
        To access, correct or delete your information, contact us at {siteConfig.office.email}.
      </p>
      <h2>Indicative prices &amp; not a stock exchange</h2>
      <p>
        All prices on this website are indicative only. {siteConfig.name} is not a stock exchange. Unlisted shares carry
        liquidity and market risks.
      </p>
    </div>
  );
}
