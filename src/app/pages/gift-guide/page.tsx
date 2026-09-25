import Image from "next/image";
import Link from "next/link";
import { storefront } from "@/config/site";
import { allProducts } from "@/content/catalog";
import { metadataForPage } from "@/lib/seo";
import { ProductRail } from "@/components/product-rail";
export const metadata = metadataForPage("/pages/gift-guide");
export default function Page() {
  return (
    <>
      <div className="page-heading">
        <h1>{storefront.giftGuide.title}</h1>
        <p>{storefront.giftGuide.text}</p>
      </div>
      <section className="brand-banner">
        <div className="banner-photo">
          <Image
            src={storefront.giftGuide.image}
            alt={storefront.giftGuide.alt}
            fill
            preload
            sizes="(max-width:700px) 100vw, 60vw"
          />
        </div>
        <div className="banner-copy">
          <h2>Let them choose.</h2>
          <p>{allProducts().find((p) => p.handle === "gift-card")?.summary}</p>
          <Link href="/products/gift-card" className="button-link">
            Shop the gift card
          </Link>
        </div>
      </section>
      <ProductRail
        title="Under $50"
        products={allProducts().filter((p) => p.priceUsd < 50)}
      />
      <ProductRail
        title="Under $100"
        products={allProducts().filter(
          (p) => p.kind === "apparel" && p.priceUsd < 100,
        )}
      />
    </>
  );
}
