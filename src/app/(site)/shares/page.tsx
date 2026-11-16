import type { Metadata } from "next";
import { getShares } from "@/lib/data";
import { SharesDirectory } from "@/components/shares/SharesDirectory";

export const metadata: Metadata = {
  title: "All Unlisted Shares",
  description: "Search unlisted and pre-IPO shares by company name or ISIN. Filter by sector and DRHP status. Indicative prices only.",
};

export default async function SharesPage() {
  const shares = await getShares();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">All unlisted shares</h1>
      <p className="mb-6 mt-2 text-muted">Indicative prices for unlisted and pre-IPO companies.</p>
      <SharesDirectory shares={shares} />
    </div>
  );
}
