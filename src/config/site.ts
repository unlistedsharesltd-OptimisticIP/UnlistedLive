// Editable site content. Brand colours live in src/app/globals.css (:root variables).

export const siteConfig = {
  name: "Optimistic IP",
  tagline: "Unlisted & Pre-IPO Shares, Simplified",
  description:
    "Discover indicative prices for unlisted and pre-IPO shares, sell your ESOP shares, and learn how the unlisted market works.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  complianceNotice:
    "Indicative prices only. Optimistic IP is not a stock exchange, and unlisted/pre-IPO shares carry liquidity and market risks.",

  nav: [
    { href: "/", label: "Home" },
    { href: "/shares", label: "All Shares" },
    { href: "/sell-esop", label: "Sell ESOP Shares" },
    { href: "/knowledge-centre", label: "Knowledge Centre" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],

  // Placeholder figures — replace with client-approved numbers.
  stats: [
    { value: "20+", label: "Unlisted companies tracked" },
    { value: "1,000+", label: "Investor enquiries handled" },
    { value: "₹50 Cr+", label: "Transactions facilitated" },
    { value: "24 hrs", label: "Typical callback time" },
  ],

  howItWorks: [
    { title: "Browse", text: "Explore unlisted and pre-IPO companies with indicative prices and key financials." },
    { title: "Enquire", text: "Request a callback for the share you're interested in — buying or selling." },
    { title: "Get guidance", text: "Our team explains pricing, lot sizes, timelines and risks before you decide." },
    { title: "Transfer", text: "Shares are transferred to your demat account once the deal is agreed." },
  ],

  office: {
    address: "Placeholder Address, Mumbai, Maharashtra, India",
    phone: "+91 99999 99999",
    email: "hello@example.com",
    hours: "Mon–Sat, 10:00 AM – 7:00 PM IST",
  },

  whatsapp: {
    number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
    message:
      process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ??
      "Hi Optimistic IP, I'd like to know more about unlisted shares.",
  },
};

export const DRHP_STATUSES = [
  { value: "not_filed", label: "DRHP Not Filed" },
  { value: "filed", label: "DRHP Filed" },
  { value: "approved", label: "DRHP Approved" },
] as const;
