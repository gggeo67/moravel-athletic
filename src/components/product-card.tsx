import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/content/catalog";
import { usd } from "@/lib/cart";
export function ProductCard({ product }: { product: Product }) {
  const first = product.images[0];
  const second = product.images[1] ?? first;
  return (
    <article className="product-card">
      <Link href={`/products/${product.handle}`}>
        <div className="product-photo">
          <Image
            className="primary"
            src={first.src}
            alt={first.alt}
            fill
            sizes="(max-width:700px) 48vw, 24vw"
          />
          <Image
            className="alternate"
            src={second.src}
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width:700px) 48vw, 24vw"
          />
        </div>
        <div className="product-meta">
          <h3>{product.name}</h3>
          <span>
            {product.kind === "gift-card" ? "From " : ""}
            {usd(product.priceUsd)}
          </span>
        </div>
      </Link>
      <p className="color-count">
        {product.kind === "gift-card"
          ? "Two denominations"
          : `${product.colors.length} colors`}
      </p>
      {product.kind === "apparel" && (
        <div className="swatch-dots" aria-hidden="true">
          {product.colors.map((c) => (
            <span
              key={c.name}
              className={`swatch-dot swatch-${c.name.toLowerCase()}`}
            />
          ))}
        </div>
      )}
    </article>
  );
}
