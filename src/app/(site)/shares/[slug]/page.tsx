import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getPriceHistory, getShareBySlug } from "@/lib/data";
import { formatDate, formatINR } from "@/lib/format";
import { CompanyLogo, DrhpBadge } from "@/components/shares/ShareBits";
import { PriceChart } from "@/components/shares/PriceChart";
import { LeadForm } from "@/components/forms/LeadForm";
import { siteConfig } from "@/config/site";

export async function generateMetadata({ params }: PageProps<"/shares/[slug]">): Promise<Metadata> {
  const share = await getShareBySlug((await params).slug);
  if (!share) return { title: "Share not found" };
  return {
    title: `${share.name} Unlisted Share Price`,
    description: `${share.name} (${share.sector}) indicative unlisted share price ${formatINR(share.indicative_price)}, lot size ${share.lot_size}, financials and shareholding. Indicative only.`,
    alternates: { canonical: `/shares/${share.slug}` },
  };
}

export default function ShareDetailPage({ params }: PageProps<"/shares/[slug]">) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link href="/shares" className="text-sm font-medium text-brand">← All shares</Link>
      <Suspense fallback={<p className="py-20 text-center text-muted">Loading…</p>}>
        {params.then(({ slug }) => <ShareDetail slug={slug} />)}
      </Suspense>
    </div>
  );
}

async function ShareDetail({ slug }: { slug: string }) {
  const share = await getShareBySlug(slug);
  if (!share) notFound();
  const history = await getPriceHistory(share.id);

  return (
    <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        {/* Header */}
        <section className="card p-5">
          <div className="flex items-start gap-4">
            <CompanyLogo share={share} size={64} />
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold sm:text-3xl">{share.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <DrhpBadge status={share.drhp_status} />
                <span className="text-sm text-muted">{share.sector}</span>
              </div>
            </div>
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-xs text-muted">Indicative price</dt>
              <dd className="text-2xl font-bold text-brand">{formatINR(share.indicative_price)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Lot size</dt>
              <dd className="font-semibold">{share.lot_size} shares</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">ISIN</dt>
              <dd className="font-mono text-sm font-semibold">{share.isin ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Last updated</dt>
              <dd className="text-sm font-semibold">{formatDate(share.updated_at)}</dd>
            </div>
          </dl>
          <p className="mt-4 rounded-lg bg-warning-bg p-3 text-xs text-warning-fg">{siteConfig.complianceNotice}</p>
        </section>

        {/* Price chart */}
        <section className="card p-5">
          <h2 className="mb-4 text-lg font-semibold">Indicative price history</h2>
          <PriceChart data={history} />
        </section>

        {/* Overview */}
        {share.overview && (
          <section className="card p-5">
            <h2 className="mb-2 text-lg font-semibold">Company overview</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">{share.overview}</p>
          </section>
        )}

        {/* Financials */}
        {share.financials.length > 0 && (
          <section className="card p-5">
            <h2 className="mb-4 text-lg font-semibold">Key financials</h2>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {share.financials.map((f) => (
                <div key={f.label} className="rounded-lg bg-background p-3">
                  <dt className="text-xs text-muted">{f.label}</dt>
                  <dd className="mt-1 font-semibold">{f.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* Shareholding */}
        {share.shareholding.length > 0 && (
          <section className="card p-5">
            <h2 className="mb-4 text-lg font-semibold">Shareholding pattern</h2>
            <ul className="space-y-3">
              {share.shareholding.map((h) => (
                <li key={h.category}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{h.category}</span>
                    <span className="font-semibold">{h.percent}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-background">
                    <div className="h-2 rounded-full bg-brand" style={{ width: `${Math.min(100, h.percent)}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Enquiry form */}
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <LeadForm
          enquiryType="share_enquiry"
          title={`Enquire about ${share.name}`}
          shareId={share.id}
          companyName={share.name}
          showQuantity
        />
      </aside>
    </div>
  );
}
