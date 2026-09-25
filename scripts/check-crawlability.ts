/**
 * Crawlability checker. Runs against a live server and asserts what is easy to
 * break silently: real 404s, unique titles and descriptions, absolute
 * canonicals, server-rendered navigation, robots/sitemap behaviour, noindex,
 * valid JSON-LD and working internal links.
 *
 *   bun run check:crawlability
 *   bun run check:crawlability -- --base http://127.0.0.1:3019 --expect-indexable
 */
import { publicRoutes, site } from "../src/config/site";

type Result = { ok: boolean; name: string; detail?: string };

const args = process.argv.slice(2);
const flag = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

const BASE = (flag("base") ?? "http://127.0.0.1:3019").replace(/\/$/, "");
const EXPECT_INDEXABLE = args.includes("--expect-indexable");

const results: Result[] = [];
const check = (name: string, ok: boolean, detail?: string) => results.push({ ok, name, detail });

async function get(path: string) {
  const res = await fetch(`${BASE}${path}`, { redirect: "manual" });
  return { res, body: await res.text() };
}

const tag = (html: string, re: RegExp) => html.match(re)?.[1]?.trim();
const titleOf = (h: string) => tag(h, /<title[^>]*>([^<]*)<\/title>/i);
const descOf = (h: string) => tag(h, /<meta[^>]+name="description"[^>]+content="([^"]*)"/i);
const canonicalOf = (h: string) => tag(h, /<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i);
const robotsOf = (h: string) => tag(h, /<meta[^>]+name="robots"[^>]+content="([^"]*)"/i);

async function main() {
  console.log(`Checking ${BASE}\n`);

  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();

  for (const { href } of publicRoutes()) {
    const { res, body } = await get(href);
    check(`200 ${href}`, res.status === 200, `got ${res.status}`);

    const title = titleOf(body);
    const desc = descOf(body);
    const canonical = canonicalOf(body);
    check(`title ${href}`, Boolean(title), "missing <title>");
    check(`description ${href}`, Boolean(desc), "missing meta description");
    check(`canonical ${href}`, Boolean(canonical?.startsWith("https://")), `canonical was ${canonical ?? "missing"}`);
    check(
      `canonical has no trailing slash ${href}`,
      !canonical || href === "/" || !canonical.endsWith("/"),
      `canonical ${canonical}`,
    );
    check(
      `nav in initial HTML ${href}`,
      site.navigation.every((n) => body.includes(`href="${n.href}"`)),
      "navigation links absent from server HTML",
    );
    check(`no malformed links ${href}`, !/href="[^"]*\)[:;]/.test(body));

    if (title) titles.set(href, title);
    if (desc) descriptions.set(href, desc);
  }

  check("titles are unique", new Set(titles.values()).size === titles.size);
  check("descriptions are unique", new Set(descriptions.values()).size === descriptions.size);

  {
    const { body } = await get("/");
    check("home renders the brand name server-side", body.includes(site.name.replace("&", "&amp;")));
  }

  for (const path of [
    "/definitely-not-a-page",
    "/products/not-a-product",
    "/collections/not-a-collection",
    "/pages/not-a-page",
    "/pages/faq).",
  ]) {
    const { res } = await get(path);
    check(`404 ${path}`, res.status === 404, `got ${res.status}`);
  }

  for (const funnel of ["/cart", "/checkout", "/checkout/payment"]) {
    const { res, body } = await get(funnel);
    check(`200 ${funnel}`, res.status === 200, `got ${res.status}`);
    check(`${funnel} is noindex`, /noindex/i.test(robotsOf(body) ?? ""));
  }

  {
    const { res, body } = await get("/robots.txt");
    check("robots.txt 200", res.status === 200, `got ${res.status}`);
    if (EXPECT_INDEXABLE) {
      check("robots allows crawling", /Allow: \//.test(body));
      check("robots names OAI-SearchBot", /OAI-SearchBot/i.test(body));
      check("robots references the sitemap", /Sitemap:/i.test(body));
    } else {
      check("robots blocks crawling when not indexable", /Disallow: \//.test(body), body.slice(0, 200));
      check("robots advertises no sitemap when not indexable", !/Sitemap:/i.test(body));
    }
  }

  {
    const { res, body } = await get("/sitemap.xml");
    check("sitemap.xml 200", res.status === 200, `got ${res.status}`);
    const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    if (EXPECT_INDEXABLE) {
      check("sitemap has entries", locs.length > 0);
      check("sitemap URLs are absolute https", locs.every((l) => l.startsWith("https://")));
      check("sitemap has no duplicates", new Set(locs).size === locs.length);
      check("sitemap excludes the funnel", !locs.some((l) => /\/(cart|checkout)/.test(l)));
    } else {
      check("sitemap is empty when not indexable", locs.length === 0, `${locs.length} entries`);
    }
  }

  {
    const { res, body } = await get("/llms.txt");
    check("llms.txt 200", res.status === 200, `got ${res.status}`);
    check("llms.txt names the brand", body.startsWith(`# ${site.name}`));
  }

  {
    const { body } = await get("/");
    const robots = robotsOf(body) ?? "";
    check(
      EXPECT_INDEXABLE ? "no accidental noindex" : "noindex emitted when indexing is disabled",
      EXPECT_INDEXABLE ? !/noindex/i.test(robots) : /noindex/i.test(robots),
      `robots meta was "${robots}"`,
    );

    const blocks = [...body.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(
      (m) => m[1],
    );
    check("JSON-LD present", blocks.length > 0);
    check(
      "all JSON-LD parses",
      blocks.every((b) => {
        try {
          JSON.parse(b.replace(/\\u003c/g, "<"));
          return true;
        } catch {
          return false;
        }
      }),
    );
    check("no fabricated rating markup", !/aggregateRating|ratingValue|reviewCount/.test(blocks.join("")));

    const hrefs = [...new Set([...body.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1]))].filter(
      (h) => !h.startsWith("/_next"),
    );
    for (const href of hrefs) {
      const { res } = await get(href);
      check(`internal link ${href}`, res.status === 200, `got ${res.status}`);
    }
  }

  const failed = results.filter((r) => !r.ok);
  for (const r of failed) console.log(`FAIL  ${r.name}${r.detail ? ` — ${r.detail}` : ""}`);
  console.log(
    `\n${results.length - failed.length}/${results.length} checks passed` +
      (EXPECT_INDEXABLE ? " (indexable mode)" : " (non-indexable mode)"),
  );
  if (failed.length) process.exit(1);
}

main().catch((error) => {
  console.error("Checker could not run:", error);
  process.exit(1);
});
