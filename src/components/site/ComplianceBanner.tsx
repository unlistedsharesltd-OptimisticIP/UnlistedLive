import Link from "next/link";
import { siteConfig } from "@/config/site";

export function ComplianceBanner() {
  return (
    <div role="note" className="border-b border-warning-fg/20 bg-warning-bg px-4 py-2 text-center text-xs text-warning-fg sm:text-sm">
      <strong>Important:</strong> {siteConfig.complianceNotice}{" "}
      <Link href="/disclaimer" className="underline">
        Read disclaimer
      </Link>
    </div>
  );
}
