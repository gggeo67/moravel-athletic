import { cookies, headers } from "next/headers";
import { attributionCookie, parseAttribution } from "./visit-attribution";
import { analyticsCookie, parseAnalyticsCookie } from "./experiment-analytics";
/** Null is expected for declined/blocked/missing/expired attribution. Never guesses. */
export async function submissionAttribution(): Promise<string | null> {
  try {
    const h = await headers();
    if (h.get("sec-gpc") === "1" || h.get("dnt") === "1") return null;
    const jar = await cookies();
    if (!parseAnalyticsCookie(jar.get(analyticsCookie)?.value)) return null;
    const a = parseAttribution(
      decodeURIComponent(jar.get(attributionCookie)?.value ?? ""),
    );
    return a ? JSON.stringify(a) : null;
  } catch {
    return null;
  }
}
