"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { siteConfig } from "@/config/site";
import { Logo } from "./Logo";

type NavProps = { mobile?: boolean; onNavigate?: () => void };

function NavItems({ mobile, onNavigate, pathname }: NavProps & { pathname: string | null }) {
  const isActive = (href: string) =>
    pathname !== null && (href === "/" ? pathname === "/" : pathname.startsWith(href));
  return siteConfig.nav.map((item) => (
    <Link
      key={item.href}
      href={item.href}
      onClick={onNavigate}
      className={
        mobile
          ? `block rounded-md px-3 py-3 text-base font-medium ${isActive(item.href) ? "bg-brand-light text-brand" : "text-foreground"}`
          : `rounded-md px-3 py-2 text-sm font-medium ${isActive(item.href) ? "bg-brand-light text-brand" : "text-muted hover:text-foreground"}`
      }
    >
      {item.label}
    </Link>
  ));
}

// The pathname is runtime data, so active highlighting streams in behind Suspense.
function ActiveNavItems(props: NavProps) {
  return <NavItems {...props} pathname={usePathname()} />;
}

function Nav(props: NavProps) {
  return (
    <Suspense fallback={<NavItems {...props} pathname={null} />}>
      <ActiveNavItems {...props} />
    </Suspense>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" onClick={close}>
          <Logo />
        </Link>

        <nav className="hidden gap-1 lg:flex">
          <Nav />
        </nav>

        <button
          type="button"
          className="rounded-md p-2 text-foreground lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-border bg-surface px-4 py-2 lg:hidden">
          <Nav mobile onNavigate={close} />
        </nav>
      )}
    </header>
  );
}
