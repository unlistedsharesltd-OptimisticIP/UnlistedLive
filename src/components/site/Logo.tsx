import { siteConfig } from "@/config/site";

// Placeholder logo — replace with the client's logo (e.g. an <Image> from /public).
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">
        OIP
      </span>
      <span className={`text-lg font-bold tracking-tight ${light ? "text-white" : "text-foreground"}`}>
        {siteConfig.name}
      </span>
    </span>
  );
}
