"use client";

import Papa from "papaparse";
import { useState, useTransition } from "react";
import { importShares, type ImportResult } from "@/lib/actions/admin";

function parse(text: string): Record<string, unknown>[] {
  const trimmed = text.trim();
  if (trimmed.startsWith("[")) return JSON.parse(trimmed);
  const res = Papa.parse<Record<string, string>>(trimmed, { header: true, skipEmptyLines: true, transformHeader: (h) => h.trim() });
  if (res.errors.length) throw new Error(`CSV error on row ${(res.errors[0].row ?? 0) + 1}: ${res.errors[0].message}`);
  return res.data;
}

export function ImportForm() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<ImportResult | null>(null);
  const [pending, start] = useTransition();

  const onFile = async (file: File | undefined) => {
    if (file) setText(await file.text());
  };

  const submit = () => {
    let rows: Record<string, unknown>[];
    try {
      rows = parse(text);
    } catch (e) {
      setResult({ ok: false, message: e instanceof Error ? e.message : "Could not parse input.", errors: [] });
      return;
    }
    start(async () => setResult(await importShares(rows)));
  };

  return (
    <div className="card max-w-3xl space-y-4 p-5">
      <div>
        <label className="label" htmlFor="file">Upload a .csv or .json file</label>
        <input id="file" type="file" accept=".csv,.json,text/csv,application/json" onChange={(e) => onFile(e.target.files?.[0])} className="text-sm" />
      </div>
      <div>
        <label className="label" htmlFor="data">…or paste CSV / JSON</label>
        <textarea id="data" rows={10} value={text} onChange={(e) => setText(e.target.value)} className="input font-mono text-xs" />
      </div>
      <button type="button" onClick={submit} disabled={pending || !text.trim()} className="btn-primary">
        {pending ? "Importing…" : "Import shares"}
      </button>
      {result && (
        <div className={`rounded-lg p-3 text-sm ${result.ok ? "bg-accent/10 text-accent-dark" : "bg-red-50 text-red-700"}`} role="status">
          <p className="font-semibold">{result.message}</p>
          {result.errors.length > 0 && (
            <ul className="mt-2 list-disc pl-5">
              {result.errors.map((e) => <li key={e}>{e}</li>)}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
