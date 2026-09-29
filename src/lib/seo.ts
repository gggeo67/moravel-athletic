/**
 * Metadata and structured data helpers.
 *
 * Two invariants:
 *  1. Every public page gets a unique title, description and canonical URL.
 *  2. When the environment is not indexable, every page emits noindex, alongside
 *     the robots.txt block (robots.txt alone is not access control).
 */

import type { Metadata } from "next";
import { site, absoluteUrl, getPage } from "@/config/site";
import { environment } from "@/config/environment";
import type { Product } from "@/content/catalog";

export const metadataBaseUrl = new URL(environment().origin);

type MetadataOptions = {
  /** Site-relative path, e.g. "/pages/faq". */
  path: string;
  title: string;
  description: string;
  /** Force noindex regardless of environment (404, cart, checkout). */
  noindex?: boolean;
};

export function metadataFor({
  path,
  title,
  description,
  noindex = false,
}: MetadataOptions): Metadata {
  const index = environment().indexable && !noindex;
  const canonical = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical },
    robots: { index, follow: index, googleBot: { index, follow: index } },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: site.locale,
      url: canonical,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** Metadata for a page registered in src/config/site.ts. */
export function metadataForPage(path: string): Metadata {
  const page = getPage(path);
  return metadataFor({
    path,
    title: page.title,
    description: page.description,
  });
}

/* ------------------------------------------------------------------ */
/* Structured data                                                     */
/* ------------------------------------------------------------------ */

export type JsonLdValue = Record<string, unknown>;

export function websiteSchema(): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.origin,
    description: site.description,
    inLanguage: site.locale,
  };
}

/** Organization markup naming the brand as operator; never an invented entity. */
export function organizationSchema(): JsonLdValue | null {
  // The operator is the brand name only: no legalName, address or phone is
  // published, and customer contact is the site's contact form.
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.operator,
    url: site.origin,
    description: site.description,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: absoluteUrl(site.contact.form),
      availableLanguage: "en",
    },
  };
}

export function breadcrumbSchema(
  trail: { name: string; path: string }[],
): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/**
 * ProductGroup with a real Offer. The Offer price reads the same catalogue
 * field the page renders. No aggregateRating or review markup: there are no
 * reviews to mark up, and inventing them is banned.
 */
export function productSchema(product: Product): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    name: product.name,
    variesBy: ["https://schema.org/size", "https://schema.org/color"],
    description: product.summary,
    color: product.colors.map((c) => c.name),
    brand: { "@type": "Brand", name: site.name },
    image: product.images.map((i) => absoluteUrl(i.src)),
    offers:
      product.kind === "gift-card"
        ? {
            "@type": "AggregateOffer",
            lowPrice: Math.min(...product.sizes.map(Number)),
            highPrice: Math.max(...product.sizes.map(Number)),
            priceCurrency: "USD",
            offerCount: product.sizes.length,
            offers: product.sizes.map((amount) => ({
              "@type": "Offer",
              price: Number(amount),
              priceCurrency: "USD",
              url: absoluteUrl(`/products/${product.handle}`),
            })),
          }
        : {
            "@type": "Offer",
            url: absoluteUrl(`/products/${product.handle}`),
            price: product.priceUsd,
            priceCurrency: "USD",

            seller: { "@type": "Organization", name: site.name },
          },
  };
}
