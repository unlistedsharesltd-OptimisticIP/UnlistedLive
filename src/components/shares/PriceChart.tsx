"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatDate, formatINR } from "@/lib/format";
import type { PricePoint } from "@/lib/types";

const shortDate = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { month: "short", year: "2-digit" });

export function PriceChart({ data }: { data: PricePoint[] }) {
  if (data.length < 2) {
    return <p className="py-10 text-center text-sm text-muted">Price history will appear after more price updates.</p>;
  }

  return (
    <div>
      <div className="h-64 w-full sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="recorded_at"
              tickFormatter={shortDate}
              tick={{ fontSize: 12, fill: "var(--muted)" }}
              axisLine={false}
              tickLine={false}
              minTickGap={24}
            />
            <YAxis
              domain={["auto", "auto"]}
              tickFormatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
              tick={{ fontSize: 12, fill: "var(--muted)" }}
              axisLine={false}
              tickLine={false}
              width={72}
            />
            <Tooltip
              cursor={{ stroke: "var(--muted)", strokeDasharray: "3 3" }}
              labelFormatter={(l) => formatDate(String(l))}
              formatter={(v) => [formatINR(Number(v)), "Indicative price"]}
              contentStyle={{ borderRadius: 8, borderColor: "var(--border)", fontSize: 13 }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="var(--brand)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, stroke: "var(--surface)", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-muted">View price history table</summary>
        <table className="mt-2 w-full text-left">
          <thead>
            <tr className="text-muted">
              <th className="py-1 font-medium">Date</th>
              <th className="py-1 text-right font-medium">Indicative price</th>
            </tr>
          </thead>
          <tbody>
            {[...data].reverse().map((p) => (
              <tr key={p.recorded_at} className="border-t border-border">
                <td className="py-1">{formatDate(p.recorded_at)}</td>
                <td className="py-1 text-right">{formatINR(p.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
