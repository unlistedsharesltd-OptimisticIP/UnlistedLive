import { requireAdminPage } from "@/lib/supabase/server";
import { siteConfig } from "@/config/site";
import { QrKit } from "@/components/admin/QrKit";

export default async function ExhibitionKitPage() {
  await requireAdminPage();
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Exhibition Kit</h1>
      <p className="mb-6 max-w-3xl text-sm text-muted">
        QR code for the Moneycontrol Exhibition stall (25–26 November 2026). Visitors who scan it are tagged with the
        source below, so every resulting enquiry is attributed to the expo.
      </p>
      <QrKit siteUrl={siteConfig.url} />
    </div>
  );
}
