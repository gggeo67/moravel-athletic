import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { join } from "node:path";

import { site, absoluteUrl, collections, pages, publicRoutes } from "../src/config/site";
import { validateOrigin } from "../src/config/environment";
import { websiteSchema, organizationSchema, breadcrumbSchema } from "../src/lib/seo";
import { allProducts } from "../src/content/catalog";
import { addLine, parseLines, resolveLines, setQuantity, MAX_PER_LINE } from "../src/lib/cart";

describe("absoluteUrl", () => {
  test("root maps to the bare origin", () => {
    expect(absoluteUrl("/")).toBe(site.origin);
  });

  test("nested paths are absolute and trailing-slash free", () => {
    expect(absoluteUrl("/pages/faq/")).toBe(`${site.origin}/pages/faq`);
    expect(absoluteUrl("pages/faq")).toBe(`${site.origin}/pages/faq`);
  });
});

describe("origin validation", () => {
  test("accepts the configured origin", () => {
    expect(validateOrigin(site.origin)).toEqual([]);
  });

  test("rejects http, dev hosts, example hosts and trailing slashes", () => {
    expect(validateOrigin("http://moravel-athletic.vercel.app").join(" ")).toContain("HTTPS");
    expect(validateOrigin("https://localhost:3019").length).toBeGreaterThan(0);
    expect(validateOrigin("https://www.example.com").length).toBeGreaterThan(0);
    expect(validateOrigin(`${site.origin}/`).join(" ")).toContain("trailing slash");
    expect(validateOrigin("not a url").length).toBeGreaterThan(0);
  });
});

describe("page map", () => {
  const routes = publicRoutes();

  test("hrefs, titles and descriptions are unique", () => {
    for (const key of ["href", "title", "description"] as const) {
      const values = routes.map((r) => r[key]);
      expect(new Set(values).size).toBe(values.length);
    }
  });

  test("every configured static page has a route file", () => {
    for (const page of Object.values(pages)) {
      const file = join("src/app", page.href, "page.tsx");
      expect(existsSync(file)).toBe(true);
    }
  });

  test("the pages agreed for the Moravel pair are all present", () => {
    const hrefs = routes.map((r) => r.href);
    for (const href of [
      "/",
      "/collections/womens",
      "/collections/mens",
      "/pages/gift-guide",
      "/pages/size-guide",
      "/pages/our-story",
      "/pages/materials",
      "/blogs/journal",
      "/pages/shipping",
      "/pages/returns",
      "/pages/faq",
      "/pages/contact",
      "/pages/accessibility",
      "/policies/privacy-policy",
      "/policies/terms-of-service",
    ]) {
      expect(hrefs).toContain(href);
    }
  });

  test("navigation and footer only link to real pages", () => {
    const known = new Set([...routes.map((r) => r.href), "/cart"]);
    const links = [...site.navigation, ...site.footerGroups.flatMap((g) => g.items)];
    for (const link of links) expect(known.has(link.href)).toBe(true);
  });

  test("funnel pages are never public routes", () => {
    const hrefs = routes.map((r) => r.href);
    for (const funnel of ["/cart", "/checkout", "/checkout/payment"]) {
      expect(hrefs).not.toContain(funnel);
    }
  });

  test("collection handles are unique and kebab-case", () => {
    const handles = collections.map((c) => c.handle);
    expect(new Set(handles).size).toBe(handles.length);
    for (const h of handles) expect(h).toMatch(/^[a-z0-9-]+$/);
  });
});

describe("catalogue and cart", () => {
  test("product handles are unique and every product is priced in the agreed band", () => {
    const handles = allProducts().map((p) => p.handle);
    expect(new Set(handles).size).toBe(handles.length);
    for (const p of allProducts()) {
      expect(p.priceUsd).toBeGreaterThanOrEqual(38);
      expect(p.priceUsd).toBeLessThanOrEqual(128);
    }
  });

  test("parseLines rejects products that are not in the catalogue", () => {
    expect(parseLines([{ handle: "not-a-product", size: "M", quantity: 1 }])).toEqual([]);
    expect(parseLines("garbage")).toEqual([]);
  });

  test("resolveLines drops unknown products", () => {
    expect(resolveLines([{ id: "x::M", handle: "x", size: "M", quantity: 1 }])).toEqual([]);
  });

  test("quantities merge and cap at the per-line maximum", () => {
    let lines = addLine([], "a", "M", 3);
    lines = addLine(lines, "a", "M", 4);
    expect(lines).toHaveLength(1);
    expect(lines[0].quantity).toBe(MAX_PER_LINE);
    expect(setQuantity(lines, lines[0].id, 0)).toEqual([]);
  });
});

describe("structured data", () => {
  test("WebSite schema is well formed", () => {
    const schema = websiteSchema();
    expect(schema["@type"]).toBe("WebSite");
    expect(schema.url).toBe(site.origin);
  });

  test("Organization schema is omitted while no legal entity is configured", () => {
    expect(organizationSchema()).toBeNull();
  });

  test("BreadcrumbList positions are 1-indexed and absolute", () => {
    const schema = breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "FAQ", path: "/pages/faq" },
    ]);
    const items = schema.itemListElement as { position: number; item: string }[];
    expect(items.map((i) => i.position)).toEqual([1, 2]);
    expect(items[1].item).toBe(`${site.origin}/pages/faq`);
  });

  test("no schema invents review or rating markup", () => {
    const blob = JSON.stringify([websiteSchema(), breadcrumbSchema([{ name: "Home", path: "/" }])]);
    expect(blob).not.toMatch(/aggregateRating|reviewCount|ratingValue/);
  });
});

describe("foundation", () => {
  test("there is no root loading.tsx (it turns 404s into 200s)", () => {
    expect(existsSync("src/app/loading.tsx")).toBe(false);
  });

  test("the restock confirmation retains the existing payment URL", () => {
    expect(existsSync("src/app/checkout/payment/page.tsx")).toBe(true);
  });
});
