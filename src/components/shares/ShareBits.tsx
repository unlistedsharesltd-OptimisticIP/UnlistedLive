import Link from "next/link";
import { drhpLabel, formatINR, initials } from "@/lib/format";
import type { DrhpStatus, Share } from "@/lib/types";

const badgeStyles: Record<DrhpStatus, string> = {
  approved: "bg-accent/10 text-accent-dark",
  filed: "bg-brand-light text-brand",
  not_filed: "bg-slate-100 text-muted",
};

export function DrhpBadge({ status }: { status: DrhpStatus }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeStyles[status]}`}>
      {drhpLabel(status)}
    </span>
  );
}

export function CompanyLogo({ share, size = 48 }: { share: Pick<Share, "name" | "logo_url">; size?: number }) {
  if (share.logo_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- logos are arbitrary external URLs set in the CMS
      <img
        src={share.logo_url}
        alt={`${share.name} logo`}
        width={size}
        height={size}
        className="rounded-lg border border-border bg-white object-contain"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-lg bg-brand-light font-bold text-brand"
      style={{ width: size, height: size, fontSize: size / 2.8 }}
      aria-hidden
    >
      {initials(share.name)}
    </span>
  );
}

export function ShareCard({ share }: { share: Share }) {
  return (
    <Link
      href={`/shares/${share.slug}`}
      className="card flex flex-col gap-4 p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <CompanyLogo share={share} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold">{share.name}</h3>
          <p className="text-sm text-muted">{share.sector}</p>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-muted">Indicative price</p>
          <p className="text-xl font-bold text-brand">{formatINR(share.indicative_price)}</p>
          <p className="text-xs text-muted">Lot size: {share.lot_size}</p>
        </div>
        <DrhpBadge status={share.drhp_status} />
      </div>
    </Link>
  );
}
