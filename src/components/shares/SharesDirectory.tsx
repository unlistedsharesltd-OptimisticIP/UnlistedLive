"use client";

import { useMemo, useState } from "react";
import { DRHP_STATUSES } from "@/config/site";
import type { Share } from "@/lib/types";
import { ShareCard } from "./ShareBits";

export function SharesDirectory({ shares }: { shares: Share[] }) {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("");
  const [drhp, setDrhp] = useState("");

  const sectors = useMemo(() => [...new Set(shares.map((s) => s.sector))].sort(), [shares]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return shares.filter(
      (s) =>
        (!q || s.name.toLowerCase().includes(q) || (s.isin ?? "").toLowerCase().includes(q)) &&
        (!sector || s.sector === sector) &&
        (!drhp || s.drhp_status === drhp),
    );
  }, [shares, query, sector, drhp]);

  return (
    <div>
      <div className="card mb-6 grid gap-3 p-4 sm:grid-cols-[2fr_1fr_1fr]">
        <input
          type="search"
          placeholder="Search by company name or ISIN"
          aria-label="Search shares"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input"
        />
        <select aria-label="Filter by sector" value={sector} onChange={(e) => setSector(e.target.value)} className="input">
          <option value="">All sectors</option>
          {sectors.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select aria-label="Filter by DRHP status" value={drhp} onChange={(e) => setDrhp(e.target.value)} className="input">
          <option value="">All DRHP statuses</option>
          {DRHP_STATUSES.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
      </div>

      <p className="mb-4 text-sm text-muted">
        Showing {results.length} of {shares.length} shares
      </p>

      {results.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((s) => (
            <ShareCard key={s.id} share={s} />
          ))}
        </div>
      ) : (
        <p className="card p-6 text-muted">No shares match your search.</p>
      )}
    </div>
  );
}
