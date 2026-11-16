"use client";

import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { useRef, useState } from "react";

const TARGETS = [
  { path: "/", label: "Home page" },
  { path: "/sell-esop", label: "Sell ESOP Shares" },
  { path: "/shares", label: "All Shares" },
  { path: "/contact", label: "Contact" },
];

export function QrKit({ siteUrl }: { siteUrl: string }) {
  const [path, setPath] = useState("/");
  const [source, setSource] = useState("moneycontrol-expo");
  const svgWrap = useRef<HTMLDivElement>(null);
  const canvasWrap = useRef<HTMLDivElement>(null);

  const url = `${siteUrl.replace(/\/$/, "")}${path}?source=${encodeURIComponent(source.trim() || "moneycontrol-expo")}`;
  const isLocal = /localhost|127\.0\.0\.1/.test(siteUrl);

  const download = (href: string, ext: string) => {
    const a = document.createElement("a");
    a.href = href;
    a.download = `optimistic-ip-qr-${source || "expo"}.${ext}`;
    a.click();
  };

  const downloadPng = () => {
    const canvas = canvasWrap.current?.querySelector("canvas");
    if (canvas) download(canvas.toDataURL("image/png"), "png");
  };

  const downloadSvg = () => {
    const svg = svgWrap.current?.querySelector("svg");
    if (!svg) return;
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" });
    const href = URL.createObjectURL(blob);
    download(href, "svg");
    URL.revokeObjectURL(href);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="card space-y-4 p-5">
        <div>
          <label className="label" htmlFor="target">Landing page</label>
          <select id="target" value={path} onChange={(e) => setPath(e.target.value)} className="input">
            {TARGETS.map((t) => <option key={t.path} value={t.path}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="source">Source tag</label>
          <input id="source" value={source} onChange={(e) => setSource(e.target.value)} className="input font-mono" />
          <p className="mt-1 text-xs text-muted">Every lead from this QR is saved with this source, visible in Leads and the CSV export.</p>
        </div>
        <div>
          <p className="label">Encoded URL</p>
          <p className="break-all rounded-lg bg-background p-3 font-mono text-sm">{url}</p>
          {isLocal && (
            <p className="mt-2 text-sm text-red-600">
              NEXT_PUBLIC_SITE_URL points to localhost — set it to the live domain before printing.
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={downloadPng} className="btn-primary">Download PNG (2048px)</button>
          <button type="button" onClick={downloadSvg} className="btn-outline">Download SVG (vector, best for print)</button>
        </div>
      </div>

      <div className="card flex flex-col items-center p-5">
        <div ref={svgWrap} className="w-full max-w-[300px]">
          <QRCodeSVG value={url} size={300} level="H" marginSize={4} title="Exhibition QR code" style={{ width: "100%", height: "auto" }} />
        </div>
        <p className="mt-3 text-center text-sm text-muted">Scan to test before printing.</p>
        {/* Hidden high-resolution canvas used for PNG export */}
        <div ref={canvasWrap} className="hidden">
          <QRCodeCanvas value={url} size={2048} level="H" marginSize={4} />
        </div>
      </div>
    </div>
  );
}
