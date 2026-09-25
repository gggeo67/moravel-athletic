import type { MetadataRoute } from "next";
import { environment } from "@/config/environment";

/**
 * robots.txt
 *
 * robots.txt is not access control and not a noindex mechanism: a disallowed
 * crawler never fetches the page, so never sees its noindex. The app emits
 * both (see lib/seo.ts) and treats neither as sufficient alone.
 */
export default function robots(): MetadataRoute.Robots {
  const env = environment();

  if (!env.indexable) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  const disallow = ["/api/", "/cart", "/checkout"];

  // OAI-SearchBot builds the ChatGPT Search index; ChatGPT-User fetches live
  // for a user; GPTBot collects training data and is configured separately.
  const rules: MetadataRoute.Robots["rules"] = [
    { userAgent: "*", allow: "/", disallow },
    { userAgent: "OAI-SearchBot", allow: "/", disallow },
    { userAgent: "ChatGPT-User", allow: "/", disallow },
    env.allowAiTraining
      ? { userAgent: "GPTBot", allow: "/", disallow }
      : { userAgent: "GPTBot", disallow: "/" },
  ];

  return { rules, sitemap: `${env.origin}/sitemap.xml`, host: env.origin };
}
