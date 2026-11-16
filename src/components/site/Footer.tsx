import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-16 bg-brand-dark text-white/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <Logo light />
          <p className="mt-3 text-sm">{siteConfig.tagline}</p>
        </div>
        <div>
          <h3 className="mb-2 font-semibold text-white">Explore</h3>
          <ul className="space-y-1 text-sm">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-semibold text-white">Contact</h3>
          <ul className="space-y-1 text-sm">
            <li>{siteConfig.office.address}</li>
            <li>{siteConfig.office.phone}</li>
            <li>{siteConfig.office.email}</li>
            <li className="pt-2">
              <Link href="/disclaimer" className="hover:text-white">Disclaimer</Link>
              {" · "}
              <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs">
        <p className="mx-auto max-w-4xl">{siteConfig.complianceNotice}</p>
        <p className="mt-2">© {siteConfig.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
