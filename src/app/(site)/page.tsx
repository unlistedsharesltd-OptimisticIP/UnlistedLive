import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getShares } from "@/lib/data";
import { ShareCard } from "@/components/shares/ShareBits";

export default async function HomePage() {
  const featured = (await getShares()).filter((s) => s.featured).slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand to-brand-dark text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <p className="mb-3 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
            Unlisted · Pre-IPO · ESOP liquidity
          </p>
          <h1 className="max-w-2xl text-3xl font-bold leading-tight sm:text-5xl">{siteConfig.tagline}</h1>
          <p className="mt-4 max-w-xl text-base text-white/80 sm:text-lg">{siteConfig.description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/shares" className="btn bg-white py-3 text-brand hover:bg-brand-light">
              Browse all shares
            </Link>
            <Link href="/sell-esop" className="btn-accent py-3">
              Sell your ESOP shares
            </Link>
          </div>
        </div>
      </section>

      {/* Featured shares */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold">Featured shares</h2>
          <Link href="/shares" className="text-sm font-semibold text-brand">View all →</Link>
        </div>
        {featured.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((s) => (
              <ShareCard key={s.id} share={s} />
            ))}
          </div>
        ) : (
          <p className="card p-6 text-muted">Featured shares will appear here soon.</p>
        )}
      </section>

      {/* Stats */}
      <section className="bg-surface">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-12 lg:grid-cols-4">
          {siteConfig.stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-brand">{s.value}</p>
              <p className="mt-1 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold">How it works</h2>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {siteConfig.howItWorks.map((step, i) => (
            <li key={step.title} className="card p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-3 font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="card flex flex-col items-start gap-4 bg-brand-light p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">Holding ESOPs or unlisted shares?</h2>
            <p className="text-sm text-muted">Tell us what you hold and we&apos;ll help you explore liquidity options.</p>
          </div>
          <Link href="/sell-esop" className="btn-primary py-3">Get a callback</Link>
        </div>
      </section>
    </>
  );
}
