"use client";

import { useActionState } from "react";
import { submitLead, type LeadFormState } from "@/lib/actions/leads";
import { getStoredSource } from "@/components/site/SourceTracker";
import type { EnquiryType } from "@/lib/types";

type Props = {
  enquiryType: EnquiryType;
  title?: string;
  submitLabel?: string;
  shareId?: string;
  companyName?: string;
  /** Show editable company name + quantity fields (Sell ESOP). */
  showCompanyAndQuantity?: boolean;
  /** Show quantity only (share enquiry). */
  showQuantity?: boolean;
};

export function LeadForm({
  enquiryType,
  title,
  submitLabel = "Request a callback",
  shareId,
  companyName,
  showCompanyAndQuantity = false,
  showQuantity = false,
}: Props) {
  const [state, action, pending] = useActionState<LeadFormState, FormData>(async (prev, fd) => {
    fd.set("source", getStoredSource());
    fd.set("page_path", window.location.pathname);
    return submitLead(prev, fd);
  }, null);

  if (state?.ok) {
    return (
      <div className="card p-6 text-center" role="status">
        <p className="text-lg font-semibold text-accent-dark">✓ {state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="card space-y-4 p-5">
      {title && <h2 className="text-lg font-semibold">{title}</h2>}
      <input type="hidden" name="enquiry_type" value={enquiryType} />
      {shareId && <input type="hidden" name="share_id" value={shareId} />}
      {/* Honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="lf-name">Name *</label>
          <input id="lf-name" name="name" required className="input" autoComplete="name" />
        </div>
        <div>
          <label className="label" htmlFor="lf-phone">Phone *</label>
          <input id="lf-phone" name="phone" type="tel" required className="input" autoComplete="tel" placeholder="+91" />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="lf-email">Email</label>
        <input id="lf-email" name="email" type="email" className="input" autoComplete="email" />
      </div>

      {showCompanyAndQuantity ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="lf-company">Company name *</label>
            <input id="lf-company" name="company_name" required className="input" defaultValue={companyName} />
          </div>
          <div>
            <label className="label" htmlFor="lf-qty">Approx. quantity / ESOPs</label>
            <input id="lf-qty" name="quantity" className="input" inputMode="numeric" />
          </div>
        </div>
      ) : (
        <>
          {companyName && (
            <div>
              <label className="label" htmlFor="lf-company">Share</label>
              <input id="lf-company" name="company_name" className="input bg-background" defaultValue={companyName} readOnly />
            </div>
          )}
          {showQuantity && (
            <div>
              <label className="label" htmlFor="lf-qty">Quantity (optional)</label>
              <input id="lf-qty" name="quantity" className="input" inputMode="numeric" />
            </div>
          )}
        </>
      )}

      <div>
        <label className="label" htmlFor="lf-message">{showCompanyAndQuantity ? "Notes" : "Message"}</label>
        <textarea id="lf-message" name="message" rows={3} className="input" />
      </div>

      {state && !state.ok && (
        <p className="text-sm text-red-600" role="alert">{state.message}</p>
      )}

      <button type="submit" disabled={pending} className="btn-accent w-full py-3">
        {pending ? "Submitting…" : submitLabel}
      </button>
      <p className="text-xs text-muted">
        By submitting, you agree to be contacted by Optimistic IP. Prices shown are indicative only.
      </p>
    </form>
  );
}
