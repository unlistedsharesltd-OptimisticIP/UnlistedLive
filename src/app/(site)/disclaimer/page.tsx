import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Important disclosures: indicative prices only; Optimistic IP is not a stock exchange.",
};

// Placeholder legal copy — must be reviewed by the client's legal/compliance team before launch.
export default function DisclaimerPage() {
  return (
    <div className="prose prose-slate mx-auto max-w-3xl px-4 py-10">
      <h1>Disclaimer</h1>
      <div className="not-prose rounded-xl border-2 border-warning-fg/30 bg-warning-bg p-5 text-warning-fg">
        <p className="font-semibold">Indicative prices only.</p>
        <p className="mt-1 font-semibold">{siteConfig.name} is not a stock exchange.</p>
        <p className="mt-1">Unlisted and pre-IPO shares carry significant liquidity and market risks.</p>
      </div>
      <h2>Indicative prices</h2>
      <p>
        All prices displayed on this website are indicative only and are not quotes, offers or solicitations to buy or
        sell any security. Actual transaction prices are determined by negotiation between buyer and seller and may
        differ materially from prices shown.
      </p>
      <h2>Not a stock exchange</h2>
      <p>
        {siteConfig.name} is not a stock exchange, broker-dealer platform or recognised trading venue. Unlisted shares
        are not traded on any recognised stock exchange and are not covered by exchange investor-protection mechanisms.
      </p>
      <h2>Risks</h2>
      <ul>
        <li><strong>Liquidity risk:</strong> you may not be able to sell unlisted shares when you want, or at all.</li>
        <li><strong>Market risk:</strong> valuations can fall significantly, including below the purchase price.</li>
        <li><strong>Information risk:</strong> unlisted companies are subject to limited disclosure requirements.</li>
        <li><strong>Lock-in:</strong> pre-IPO shareholdings are typically subject to lock-in after listing.</li>
        <li><strong>No guarantee of listing:</strong> a DRHP filing or approval does not guarantee an IPO will happen.</li>
      </ul>
      <h2>No investment advice</h2>
      <p>
        Information on this website is for general educational purposes only and does not constitute investment, tax or
        legal advice. Please consult a qualified advisor before making any investment decision.
      </p>
    </div>
  );
}
