import Image from "next/image";
import Link from "next/link";
import { site, storefront } from "@/config/site";
import { allProducts } from "@/content/catalog";
import { metadataFor } from "@/lib/seo";
import { NewArrivals } from "@/components/product-rail";
import { FabricTiles, CategoryRail, BrandBanner } from "@/components/editorial";
export const metadata = metadataFor({
  path: "/",
  title: `${site.name} · ${site.line}`,
  description: site.description,
});
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-photo">
          <Image
            src={storefront.hero.image}
            alt={storefront.hero.alt}
            fill
            preload
            quality={85}
            sizes="(max-width: 700px) 818px, 100vw"
          />
        </div>
        <div className="hero-copy">
          <h1>{storefront.hero.title}</h1>
          <p>{storefront.hero.text}</p>
          <div className="hero-actions">
            <Link className="button-link" href="/collections/womens">
              Shop Women
            </Link>
            <Link className="button-link outline" href="/collections/mens">
              Shop Men
            </Link>
          </div>
        </div>
      </section>
      <section className="wrap section-space">
        <div className="section-heading">
          <h2>{storefront.categoryTitle}</h2>
        </div>
        <CategoryRail />
      </section>
      <NewArrivals products={allProducts()} />
      <BrandBanner />
      <FabricTiles />
    </>
  );
}
