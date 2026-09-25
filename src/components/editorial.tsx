import Image from "next/image";
import Link from "next/link";
import { categories, fabricLines, storefront } from "@/config/site";
import { productsIn } from "@/content/catalog";
export function CategoryRail({ audience }: { audience?: string }) {
  return (
    <div className="category-rail" tabIndex={0} aria-label="Shop by category">
      {categories
        .filter(
          (c) =>
            !audience ||
            productsIn(audience).some((p) => p.category === c.value),
        )
        .map((c) => (
          <Link
            href={`/collections/${audience ?? c.audience}?category=${encodeURIComponent(c.value)}`}
            key={c.value}
          >
            <div className="category-image">
              <Image
                src={
                  audience
                    ? productsIn(audience).find((p) => p.category === c.value)!
                        .images[0].src
                    : c.image
                }
                alt={c.name}
                fill
                sizes="(max-width:700px) 42vw, 17vw"
              />
            </div>
            <h3>{c.name}</h3>
          </Link>
        ))}
    </div>
  );
}
export function FabricTiles() {
  return (
    <section className="fabric-section section-space">
      <div className="wrap">
        <div className="section-heading">
          <div>
            <h2>{storefront.fabrics.title}</h2>
            <p>{storefront.fabrics.text}</p>
          </div>
          <Link href="/pages/materials" className="text-link">
            Explore the materials
          </Link>
        </div>
        <div className="fabric-grid">
          {fabricLines.map((f) => (
            <Link
              className="fabric-card"
              key={f.handle}
              href={`/collections/${f.handle}`}
            >
              <div className="editorial-photo">
                <Image
                  src={f.image}
                  alt={f.alt}
                  fill
                  sizes="(max-width:700px) 100vw, 33vw"
                />
              </div>
              <h3>{f.name}</h3>
              <p>{f.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
export function BrandBanner() {
  return (
    <section className="brand-banner">
      <div className="banner-photo">
        <Image
          src={storefront.banner.image}
          alt={storefront.banner.alt}
          fill
          sizes="(max-width:700px) 100vw, 60vw"
        />
      </div>
      <div className="banner-copy">
        <h2>{storefront.banner.title}</h2>
        <p>{storefront.banner.text}</p>
        <Link className="button-link outline" href="/pages/our-story">
          Our story
        </Link>
      </div>
    </section>
  );
}
export function SplitBlock({
  block,
  reverse = false,
}: {
  block: { title: string; text: string; image: string; alt: string };
  reverse?: boolean;
}) {
  return (
    <section className={`split-block ${reverse ? "reverse" : ""}`}>
      <div className="split-photo">
        <Image
          src={block.image}
          alt={block.alt}
          fill
          sizes="(max-width:700px) 100vw, 50vw"
        />
      </div>
      <div className="split-text">
        <h2>{block.title}</h2>
        <p>{block.text}</p>
      </div>
    </section>
  );
}
