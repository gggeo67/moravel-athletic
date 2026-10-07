import { pathOnly, privatePath } from "./visit-attribution";
export type RequestSource = {
  version: 1;
  source: string;
  evidence: "tag" | "referrer" | "unknown";
  referrer_host: string;
  landing_path: string;
  at: string;
};
export function sourceEligible(
  country: string | null,
  gpc: string | null,
  dnt: string | null,
  enabled: boolean,
) {
  return enabled && country === "US" && gpc !== "1" && dnt !== "1";
}
function host(value: unknown): string {
  if (typeof value !== "string" || value.length > 253) return "";
  return /^[a-z0-9.-]+$/i.test(value) && !value.includes("..")
    ? value.toLowerCase()
    : "";
}
function classify(value: string): string {
  return value === "chatgpt.com" ||
    value.endsWith(".chatgpt.com") ||
    value === "chat.openai.com" ||
    value.endsWith(".chat.openai.com")
    ? "chatgpt.com"
    : value;
}
export function parseRequestSource(
  raw: unknown,
  now = Date.now(),
): RequestSource | null {
  try {
    if (typeof raw !== "string" || raw.length > 1024) return null;
    const v = JSON.parse(raw);
    if (
      v.version !== 1 ||
      !["tag", "referrer", "unknown"].includes(v.evidence) ||
      typeof v.landing_path !== "string" ||
      privatePath(v.landing_path) ||
      typeof v.at !== "string"
    )
      return null;
    const at = Date.parse(v.at);
    if (!Number.isFinite(at) || at > now + 60000 || now - at > 86400000)
      return null;
    const referrer_host = host(v.referrer_host);
    const source =
      v.evidence === "tag"
        ? host(v.source)
        : v.evidence === "referrer"
          ? referrer_host
          : "unknown";
    if (!source) return null;
    return {
      version: 1,
      source: classify(source),
      evidence: v.evidence,
      referrer_host,
      landing_path: pathOnly(v.landing_path),
      at: new Date(at).toISOString(),
    };
  } catch {
    return null;
  }
}
export function arrivalSource(
  href: string,
  referrer: string,
  now = Date.now(),
): RequestSource | null {
  try {
    const url = new URL(href);
    let referrer_host = "";
    try {
      const ref = new URL(referrer);
      if (/^https?:$/.test(ref.protocol) && ref.origin !== url.origin)
        referrer_host = host(ref.hostname);
    } catch {}
    const tag = host(url.searchParams.get("utm_source"));
    return parseRequestSource(
      JSON.stringify({
        version: 1,
        source: tag || referrer_host || "unknown",
        evidence: tag ? "tag" : referrer_host ? "referrer" : "unknown",
        referrer_host,
        landing_path: url.pathname,
        at: new Date(now).toISOString(),
      }),
      now,
    );
  } catch {
    return null;
  }
}
