import Link from "next/link";
import { Suspense } from "react";
import { signOut } from "@/lib/actions/admin";
import { Logo } from "@/components/site/Logo";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/shares", label: "Shares" },
  { href: "/admin/shares/import", label: "Bulk Import" },
  { href: "/admin/articles", label: "Knowledge Centre" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/exhibition-kit", label: "Exhibition Kit" },
];

export default function CmsLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <aside className="border-b border-border bg-surface md:w-56 md:border-b-0 md:border-r">
        <div className="p-4">
          <Link href="/admin"><Logo /></Link>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:pb-4">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-brand-light hover:text-brand">
              {n.label}
            </Link>
          ))}
          <Link href="/" target="_blank" className="whitespace-nowrap rounded-md px-3 py-2 text-sm text-muted hover:text-brand">
            View site ↗
          </Link>
          <form action={signOut}>
            <button type="submit" className="w-full whitespace-nowrap rounded-md px-3 py-2 text-left text-sm text-muted hover:text-red-600">
              Sign out
            </button>
          </form>
        </nav>
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-8">
        {/* Each page calls requireAdminPage(); the boundary lets it read cookies at request time. */}
        <Suspense fallback={<p className="text-muted">Loading…</p>}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}

