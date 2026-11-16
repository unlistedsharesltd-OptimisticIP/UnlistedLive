"use client";

import { useActionState, useState } from "react";
import { saveShare, type ActionState } from "@/lib/actions/admin";
import { DRHP_STATUSES } from "@/config/site";
import type { FinancialItem, Share, ShareholdingItem } from "@/lib/types";

type Row = { a: string; b: string };

function RowsEditor({
  title,
  rows,
  setRows,
  aLabel,
  bLabel,
}: {
  title: string;
  rows: Row[];
  setRows: (r: Row[]) => void;
  aLabel: string;
  bLabel: string;
}) {
  const update = (i: number, key: keyof Row, v: string) => setRows(rows.map((r, j) => (j === i ? { ...r, [key]: v } : r)));
  return (
    <fieldset className="space-y-2">
      <legend className="label">{title}</legend>
      {rows.map((r, i) => (
        <div key={i} className="flex gap-2">
          <input aria-label={aLabel} placeholder={aLabel} value={r.a} onChange={(e) => update(i, "a", e.target.value)} className="input" />
          <input aria-label={bLabel} placeholder={bLabel} value={r.b} onChange={(e) => update(i, "b", e.target.value)} className="input" />
          <button type="button" aria-label="Remove row" onClick={() => setRows(rows.filter((_, j) => j !== i))} className="btn-outline px-3">
            ×
          </button>
        </div>
      ))}
      <button type="button" onClick={() => setRows([...rows, { a: "", b: "" }])} className="text-sm font-semibold text-brand">
        + Add row
      </button>
    </fieldset>
  );
}

export function ShareForm({ share }: { share?: Share }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveShare, null);
  const [financials, setFinancials] = useState<Row[]>(
    share?.financials.map((f) => ({ a: f.label, b: f.value })) ?? [{ a: "Revenue (FY25)", b: "" }, { a: "PAT (FY25)", b: "" }],
  );
  const [shareholding, setShareholding] = useState<Row[]>(
    share?.shareholding.map((h) => ({ a: h.category, b: String(h.percent) })) ?? [
      { a: "Promoters", b: "" },
      { a: "Institutional", b: "" },
      { a: "ESOP / Employees", b: "" },
      { a: "Public / Others", b: "" },
    ],
  );

  const financialsJson = JSON.stringify(
    financials.filter((r) => r.a.trim()).map<FinancialItem>((r) => ({ label: r.a.trim(), value: r.b.trim() })),
  );
  const shareholdingJson = JSON.stringify(
    shareholding.filter((r) => r.a.trim() && r.b.trim()).map<ShareholdingItem>((r) => ({ category: r.a.trim(), percent: Number(r.b) })),
  );

  return (
    <form action={action} className="card max-w-3xl space-y-5 p-5">
      {share && <input type="hidden" name="id" value={share.id} />}
      <input type="hidden" name="financials" value={financialsJson} />
      <input type="hidden" name="shareholding" value={shareholdingJson} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">Company name *</label>
          <input id="name" name="name" required defaultValue={share?.name} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="slug">URL slug</label>
          <input id="slug" name="slug" defaultValue={share?.slug} placeholder="auto from name" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="isin">ISIN</label>
          <input id="isin" name="isin" defaultValue={share?.isin ?? ""} className="input font-mono" />
        </div>
        <div>
          <label className="label" htmlFor="sector">Sector *</label>
          <input id="sector" name="sector" required defaultValue={share?.sector} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="drhp_status">DRHP status</label>
          <select id="drhp_status" name="drhp_status" defaultValue={share?.drhp_status ?? "not_filed"} className="input">
            {DRHP_STATUSES.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="lot_size">Lot size *</label>
          <input id="lot_size" name="lot_size" type="number" min={1} step={1} required defaultValue={share?.lot_size ?? 1} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="indicative_price">Indicative price (₹) *</label>
          <input
            id="indicative_price"
            name="indicative_price"
            type="number"
            min={0}
            step="0.01"
            required
            defaultValue={share?.indicative_price}
            className="input"
          />
          <p className="mt-1 text-xs text-muted">Changing the price adds a dated point to the public price chart.</p>
        </div>
        <div>
          <label className="label" htmlFor="logo_url">Logo URL</label>
          <input id="logo_url" name="logo_url" type="url" defaultValue={share?.logo_url ?? ""} className="input" />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name="featured" defaultChecked={share?.featured} className="h-4 w-4" />
        Featured on home page
      </label>

      <div>
        <label className="label" htmlFor="overview">Company overview</label>
        <textarea id="overview" name="overview" rows={5} defaultValue={share?.overview} className="input" />
      </div>

      <RowsEditor title="Key financials" rows={financials} setRows={setFinancials} aLabel="Label (e.g. Revenue FY25)" bLabel="Value (e.g. ₹1,200 Cr)" />
      <RowsEditor title="Shareholding pattern (%)" rows={shareholding} setRows={setShareholding} aLabel="Category" bLabel="Percent" />

      {state && !state.ok && <p className="text-sm text-red-600" role="alert">{state.message}</p>}
      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Saving…" : share ? "Save changes" : "Create share"}
      </button>
    </form>
  );
}
