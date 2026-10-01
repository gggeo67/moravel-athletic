import Image from "next/image";
import Link from "next/link";
import { categories, fabricLines, storefront } from "@/config/site";
import { ShopRail } from "@/components/shop-rail";

export function HomeCategories() {
  return (
    <section className="wrap home-shopping home-categories">
      <ShopRail
        label="categories"
        variant="categories"
        heading={<h2>{storefront.categoryTitle}</h2>}
      >
        {categories.map((category) => (
          <Link
            key={category.value}
            className="home-category"
            href={`/collections/${category.audience}?category=${encodeURIComponent(category.value)}`}
          >
            <div className="home-category-image">
              <Image
                src={category.garmentImage}
                alt=""
                fill
                sizes="(max-width:700px) 44vw, (max-width:1100px) 30vw, 24vw"
              />
            </div>
            <h3>{category.name}</h3>
          </Link>
        ))}
      </ShopRail>
    </section>
  );
}

export function HomeMaterials() {
  return (
    <section className="wrap home-materials">
      <div className="home-materials-intro">
        <h2>{storefront.fabrics.title}</h2>
        <p>{storefront.fabrics.text}</p>
        <Link className="text-link" href="/pages/materials">
          Explore the materials
        </Link>
      </div>
      <div className="home-materials-list">
        {fabricLines.map((fabric) => (
          <Link
            className="home-material"
            key={fabric.handle}
            href={`/collections/${fabric.handle}`}
          >
            <div className="home-material-image">
              <Image
                src={fabric.macro}
                alt={`${fabric.name} fabric close-up`}
                fill
                sizes="(max-width:700px) 88px, 132px"
              />
            </div>
            <div>
              <h3>{fabric.name}</h3>
              <p>{fabric.description}</p>
            </div>
            <span className="home-material-link">
              Shop<span className="sr-only"> {fabric.name}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
