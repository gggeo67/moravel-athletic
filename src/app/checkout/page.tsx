import { site } from "@/config/site";
import { CheckoutView } from "@/components/checkout-view";
import { metadataFor } from "@/lib/seo";

// Funnel step over per-visitor state: noindex and absent from the sitemap.
// Captures contact and shipping details only; no card fields.
export const metadata = metadataFor({
  path: "/checkout",
  title: "Checkout",
  description: `Where your ${site.name} order ships.`,
  noindex: true,
});

export default function CheckoutPage() {
  return (
    <div className="wrap section-space">
      <h1 className="text-3xl tracking-tight">Checkout</h1>
      <CheckoutView />
    </div>
  );
}
