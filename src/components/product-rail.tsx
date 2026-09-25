"use client";
import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/content/catalog";
import { ProductCard } from "@/components/product-card";
import { storefront } from "@/config/site";
export function NewArrivals({ products }: { products: Product[] }) {
  const [audience, setAudience] = useState("womens");
  return (
    <section className="wrap section-space">
      <div className="section-heading">
        <div>
          <h2>{storefront.newArrivals.title}</h2>
          <p>{storefront.newArrivals.text}</p>
        </div>
        <div className="tabs" aria-label="Choose a collection">
          <button
            onClick={() => setAudience("womens")}
            aria-pressed={audience === "womens"}
          >
            Women
          </button>
          <button
            onClick={() => setAudience("mens")}
            aria-pressed={audience === "mens"}
          >
            Men
          </button>
          <Link className="text-link" href={`/collections/${audience}`}>
            Shop all
          </Link>
        </div>
      </div>
      <div
        className="product-rail"
        tabIndex={0}
        aria-label="Everyday favorites"
      >
        {products
          .filter((p) => p.audience === audience)
          .map((p) => (
            <ProductCard key={p.handle} product={p} />
          ))}
      </div>
    </section>
  );
}
export function ProductRail({
  title,
  products,
}: {
  title: string;
  products: Product[];
}) {
  if (!products.length) return null;
  return (
    <section className="wrap section-space">
      <div className="section-heading">
        <h2>{title}</h2>
      </div>
      <div className="product-rail" tabIndex={0} aria-label={title}>
        {products.map((p) => (
          <ProductCard key={p.handle} product={p} />
        ))}
      </div>
    </section>
  );
}
