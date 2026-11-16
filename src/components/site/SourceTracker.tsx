"use client";

import { useEffect } from "react";

const KEY = "oip_lead_source";

/** Remembers ?source= / ?utm_source= from the landing URL for the rest of the visit. */
export function SourceTracker() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const source = params.get("source") ?? params.get("utm_source");
    if (source) {
      try {
        sessionStorage.setItem(KEY, source.slice(0, 100));
      } catch {}
    }
  }, []);
  return null;
}

export function getStoredSource(): string {
  const fromUrl = new URLSearchParams(window.location.search);
  const direct = fromUrl.get("source") ?? fromUrl.get("utm_source");
  if (direct) return direct.slice(0, 100);
  try {
    return sessionStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}
