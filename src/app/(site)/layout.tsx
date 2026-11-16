import { ComplianceBanner } from "@/components/site/ComplianceBanner";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { SourceTracker } from "@/components/site/SourceTracker";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <ComplianceBanner />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <SourceTracker />
    </>
  );
}
