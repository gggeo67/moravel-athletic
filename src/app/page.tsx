import "./home.css";
import Image from "next/image";
import Link from "next/link";
import { site, storefront } from "@/config/site";
import { allProducts } from "@/content/catalog";
import { metadataFor } from "@/lib/seo";
import { NewArrivals } from "@/components/product-rail";
import { BrandBanner } from "@/components/editorial";
import { HomeCategories, HomeMaterials } from "@/components/home-editorial";
export const metadata = metadataFor({
  path: "/",
  title: `${site.name} · ${site.line}`,
  description: site.description,
});
export default function Home() {
  return (
    <div className="moravel-home">
      <section className="hero campaign-hero">
        <div className="hero-photo">
          <Image
            src={storefront.hero.image}
            alt={storefront.hero.alt}
            fill
            preload
            quality={85}
            sizes="(max-width: 700px) 1100px, 100vw"
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
      <HomeCategories />
      <NewArrivals products={allProducts()} />
      <BrandBanner />
      <HomeMaterials />
    </div>
  );
}
