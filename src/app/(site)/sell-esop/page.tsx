import type { Metadata } from "next";
import { LeadForm } from "@/components/forms/LeadForm";

export const metadata: Metadata = {
  title: "Sell ESOP & Unlisted Shares",
  description: "Hold ESOPs or unlisted shares? Share a few details and our team will call you to explore liquidity options.",
};

const steps = [
  { title: "Share your details", text: "Tell us the company, approximate quantity and how to reach you." },
  { title: "Eligibility check", text: "We confirm the shares are in demat form and transferable, and check any lock-in or company restrictions." },
  { title: "Indicative quote", text: "We share an indicative price range based on current demand. You decide whether to proceed." },
  { title: "Transfer & settlement", text: "Shares are transferred via your depository participant and settlement is completed as agreed." },
];

const faqs = [
  { q: "Can I sell ESOPs before the company lists?", a: "Often yes, once ESOPs are exercised and the shares are credited to your demat account, subject to company policies." },
  { q: "Is the price guaranteed?", a: "No. Prices for unlisted shares are indicative and depend on buyer demand at the time of the transaction." },
  { q: "Are there taxes on the sale?", a: "Capital gains tax may apply. Please consult your tax advisor for your specific situation." },
];

export default function SellEsopPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <div>
          <h1 className="text-3xl font-bold">Sell your ESOP &amp; unlisted shares</h1>
          <p className="mt-3 text-muted">
            Employees and early investors often hold valuable shares in private companies with no easy way to sell them.
            We help connect sellers with interested buyers in the unlisted market.
          </p>

          <h2 className="mt-8 text-xl font-semibold">How it works</h2>
          <ol className="mt-4 space-y-4">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="text-sm text-muted">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <h2 className="mt-8 text-xl font-semibold">Common questions</h2>
          <div className="mt-4 space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="card p-4">
                <summary className="cursor-pointer font-medium">{f.q}</summary>
                <p className="mt-2 text-sm text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <LeadForm
            enquiryType="sell_esop"
            title="Sell ESOP enquiry"
            submitLabel="Submit enquiry"
            showCompanyAndQuantity
          />
        </aside>
      </div>
    </div>
  );
}
