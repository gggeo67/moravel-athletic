import {
  attributionKey,
  attributionCookie,
  attributionDays,
  parseAttribution,
  advanceAttribution,
  touchFor,
  privatePath,
  type Attribution,
} from "./visit-attribution";
const sessionKey = attributionKey + "-session";
let arrival: { href: string; referrer: string; at: number } | null = null;
let current: Attribution | null = null;
export function rememberArrival() {
  arrival ??= {
    href: location.href,
    referrer: document.referrer,
    at: Date.now(),
  };
}
export function clearAttribution() {
  current = null;
  try {
    localStorage.removeItem(attributionKey);
    sessionStorage.removeItem(sessionKey);
  } catch {}
  document.cookie = `${attributionCookie}=; Path=/; Max-Age=0; SameSite=Lax`;
}
/** Invoke only after analytics consent. Internal pages never replace entry sources. */
export function updateAttribution(): Attribution | null {
  try {
    rememberArrival();
    if (privatePath(location.pathname)) return current;
    const now = Date.now();
    const stored = parseAttribution(localStorage.getItem(attributionKey), now);
    const prior = JSON.parse(sessionStorage.getItem(sessionKey) || "null") as {
      last: number;
      href: string;
    } | null;
    const timedOut = !!prior && now - prior.last > 1800000;
    const entry = timedOut
      ? touchFor(location.href, "", now)
      : touchFor(arrival!.href, arrival!.referrer, arrival!.at);
    const external = !!entry.referrer || !!entry.utm_source;
    const newVisit =
      !prior ||
      now - prior.last > 1800000 ||
      (prior.href !== arrival!.href && external);
    current = advanceAttribution(stored, entry, newVisit);
    const raw = JSON.stringify(current);
    localStorage.setItem(attributionKey, raw);
    sessionStorage.setItem(
      sessionKey,
      JSON.stringify({ last: now, href: arrival!.href }),
    );
    // Bound the cookie independently: browsers impose a 4KB cookie limit.
    const encoded = encodeURIComponent(raw);
    if (encoded.length < 3800)
      document.cookie = `${attributionCookie}=${encoded}; Path=/; Max-Age=${attributionDays * 86400}; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    else
      document.cookie = `${attributionCookie}=; Path=/; Max-Age=0; SameSite=Lax`;
    return current;
  } catch {
    return current;
  }
}
