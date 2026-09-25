"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/content/catalog";
import { ProductCard } from "@/components/product-card";
import { storefront } from "@/config/site";
export function CollectionShop({
  products,
  initialCategory = "",
}: {
  products: Product[];
  initialCategory?: string;
}) {
  const [category, setCategory] = useState(initialCategory);
  const [size, setSize] = useState("");
  const [sort, setSort] = useState("featured");
  const categories = [...new Set(products.map((p) => p.category))];
  const sizes = [...new Set(products.flatMap((p) => p.sizes))];
  const filtered = products
    .filter(
      (p) =>
        (!category || p.category === category) &&
        (!size || p.sizes.includes(size)),
    )
    .sort((a, b) =>
      sort === "price-low"
        ? a.priceUsd - b.priceUsd
        : sort === "price-high"
          ? b.priceUsd - a.priceUsd
          : sort === "name"
            ? a.name.localeCompare(b.name)
            : 0,
    );
  return (
    <>
      <div className="collection-controls">
        <div className="filter-group">
          <label htmlFor="category-filter" className="sr-only">
            Category
          </label>
          <select
            id="category-filter"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
          <label className="sr-only" htmlFor="size-filter">
            Size
          </label>
          <select
            id="size-filter"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            <option value="">All sizes</option>
            {sizes.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          {(category || size) && (
            <button
              className="text-link text-sm"
              onClick={() => {
                setCategory("");
                setSize("");
              }}
            >
              Clear filters
            </button>
          )}
        </div>
        <div className="filter-group">
          <span className="text-sm" role="status">
            {filtered.length} {filtered.length === 1 ? "style" : "styles"}
          </span>
          <label className="sr-only" htmlFor="sort">
            Sort
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>
      {filtered.length ? (
        <div className="product-grid">
          {filtered.map((p) => (
            <ProductCard key={p.handle} product={p} />
          ))}
          {filtered.length > 1 && (
            <Link href="/pages/materials" className="collection-editorial">
              <Image
                src={storefront.banner.image}
                alt={storefront.banner.alt}
                fill
                sizes="(max-width:700px) 100vw, 50vw"
              />
              <div className="tile-copy">
                <h2>Get to know the fabric.</h2>
                <span className="text-link">Explore our materials</span>
              </div>
            </Link>
          )}
        </div>
      ) : (
        <div className="empty-state">
          <p>No styles match these filters.</p>
          <button
            className="text-link"
            onClick={() => {
              setCategory("");
              setSize("");
            }}
          >
            Show all styles
          </button>
        </div>
      )}
    </>
  );
}
