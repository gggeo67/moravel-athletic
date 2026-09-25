import { site } from "@/config/site";
import { CartView } from "@/components/cart-view";
import { metadataFor } from "@/lib/seo";

// Per-visitor state: noindex and absent from the sitemap.
export const metadata = metadataFor({
  path: "/cart",
  title: "Your bag",
  description: `Your ${site.name} bag.`,
  noindex: true,
});

export default function CartPage() {
  return (
    <div className="wrap section-space">
      <h1 className="text-3xl tracking-tight">Your bag</h1>
      <CartView />
    </div>
  );
}
