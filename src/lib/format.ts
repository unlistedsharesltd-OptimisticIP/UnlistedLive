import { DRHP_STATUSES } from "@/config/site";
import type { DrhpStatus } from "./types";

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });

export const formatINR = (n: number) => inr.format(n);

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export const drhpLabel = (s: DrhpStatus) => DRHP_STATUSES.find((d) => d.value === s)?.label ?? s;

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter((w) => !/^(ltd|limited|pvt|private)\.?$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
