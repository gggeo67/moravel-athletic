import { environment } from "@/config/environment";
import { publicRoutes, site } from "@/config/site";
import { allProducts } from "@/content/catalog";

export const dynamic = "force-static";

/** llms.txt: a plain-text map of the site for language-model crawlers. */
export function GET() {
  const { origin } = environment();
  const link = (path: string) => (path === "/" ? origin : `${origin}${path}`);

  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.line}`,
    "",
    "## Pages",
    "",
    ...publicRoutes().map((p) => `- [${p.title}](${link(p.href)})`),
  ];

  const products = allProducts();
  if (products.length) {
    lines.push(
      "",
      "## Products",
      "",
      ...products.map((p) => `- [${p.name}](${link(`/products/${p.handle}`)}): $${p.priceUsd}. ${p.summary}`),
    );
  }

  return new Response(`${lines.join("\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
