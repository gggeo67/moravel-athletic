import type { MetadataRoute } from "next";
import { environment } from "@/config/environment";
import { publicRoutes } from "@/config/site";
import { allProducts } from "@/content/catalog";

/**
 * sitemap.xml
 *
 * Only published, canonical, indexable pages that return 200. Empty while
 * indexing is off. lastModified is omitted where no real date is tracked,
 * rather than faking freshness with `new Date()`. Cart and checkout are
 * per-visitor funnel steps and never listed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const env = environment();
  if (!env.indexable) return [];

  const url = (path: string) => (path === "/" ? env.origin : `${env.origin}${path}`);

  return [
    ...publicRoutes().map((p) => ({ url: url(p.href) })),
    ...allProducts().map((p) => ({ url: url(`/products/${p.handle}`) })),
  ];
}
