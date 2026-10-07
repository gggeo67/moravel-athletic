/** Observed browser attribution only; never infer AI traffic from missing evidence. */
export const attributionKey = "geo-attribution-v1";
export const attributionCookie = "geo_attribution_v1";
export const attributionDays = 90;
const duration = attributionDays * 86400000;
export const utmKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;
export type Touch = {
  source: string;
  referrer: string;
  landing_path: string;
  at: string;
} & Partial<Record<(typeof utmKeys)[number], string>>;
export type Attribution = {
  version: 1;
  first: Touch;
  latest: Touch;
  last_non_direct: Touch | null;
  updated_at: string;
};
export function campaign(value: unknown): string | undefined {
  return typeof value === "string" && /^[a-zA-Z0-9_. -]{1,60}$/.test(value)
    ? value
    : undefined;
}
export function pathOnly(value: string): string {
  const path = value.split(/[?#]/)[0];
  return /^\/[a-zA-Z0-9/_-]{0,119}$/.test(path) ? path : "/redacted";
}
export function privatePath(path: string) {
  return /\/(payment|confirmation|unsubscribe|receipt|account|login|auth)(\/|$)/i.test(
    path,
  );
}
export function referrerOrigin(value: string): string {
  try {
    const u = new URL(value);
    return /^https?:$/.test(u.protocol) &&
      !u.username &&
      !u.password &&
      u.hostname.length < 100
      ? u.origin
      : "";
  } catch {
    return "";
  }
}
export function touchFor(
  href: string,
  referrer: string,
  now = Date.now(),
): Touch {
  const url = new URL(href);
  const ref = referrerOrigin(referrer);
  const external = ref && ref !== url.origin ? ref : "";
  const tags = Object.fromEntries(
    utmKeys.flatMap((k) => {
      const v = campaign(url.searchParams.get(k));
      return v ? [[k, v]] : [];
    }),
  );
  return {
    source:
      tags.utm_source?.toLowerCase() ||
      (external ? new URL(external).hostname : "direct_unknown"),
    referrer: external,
    landing_path: pathOnly(url.pathname),
    at: new Date(now).toISOString(),
    ...tags,
  };
}
function cleanTouch(value: unknown, now: number): Touch | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  if (
    typeof v.at !== "string" ||
    !Number.isFinite(Date.parse(v.at)) ||
    Date.parse(v.at) > now + 60000 ||
    now - Date.parse(v.at) > duration ||
    typeof v.landing_path !== "string"
  )
    return null;
  const tags = Object.fromEntries(
    utmKeys.flatMap((k) => {
      const s = campaign(v[k]);
      return s ? [[k, s]] : [];
    }),
  );
  const ref = typeof v.referrer === "string" ? referrerOrigin(v.referrer) : "";
  return {
    source:
      tags.utm_source?.toLowerCase() ||
      (ref ? new URL(ref).hostname : "direct_unknown"),
    referrer: ref,
    landing_path: pathOnly(v.landing_path),
    at: new Date(v.at).toISOString(),
    ...tags,
  };
}
export function parseAttribution(
  raw: string | undefined | null,
  now = Date.now(),
): Attribution | null {
  try {
    if (!raw || raw.length > 3800) return null;
    const v = JSON.parse(raw);
    if (v.version !== 1) return null;
    const first = cleanTouch(v.first, now),
      latest = cleanTouch(v.latest, now);
    if (!first || !latest || Date.parse(first.at) > Date.parse(latest.at))
      return null;
    const non = cleanTouch(v.last_non_direct, now);
    return {
      version: 1,
      first,
      latest,
      last_non_direct: non?.source !== "direct_unknown" ? non : null,
      updated_at: latest.at,
    };
  } catch {
    return null;
  }
}
export function advanceAttribution(
  old: Attribution | null,
  touch: Touch,
  newVisit: boolean,
): Attribution {
  if (!old)
    return {
      version: 1,
      first: touch,
      latest: touch,
      last_non_direct: touch.source !== "direct_unknown" ? touch : null,
      updated_at: touch.at,
    };
  if (!newVisit) return old;
  return {
    ...old,
    latest: touch,
    last_non_direct:
      touch.source !== "direct_unknown" ? touch : old.last_non_direct,
    updated_at: touch.at,
  };
}
export function attributionProperties(
  a: Attribution | null,
): Record<string, string> {
  if (!a) return {};
  return {
    first_source: a.first.source,
    latest_source: a.latest.source,
    last_non_direct_source: a.last_non_direct?.source ?? "unknown",
    landing_path: a.latest.landing_path,
    first_landing_path: a.first.landing_path,
    ...Object.fromEntries(
      utmKeys.flatMap((k) => (a.latest[k] ? [[k, a.latest[k]!]] : [])),
    ),
  };
}
export function webAnalyticsEvent<T extends { url: string }>(
  event: T,
): T | null {
  try {
    const u = new URL(event.url);
    if (!/^https?:$/.test(u.protocol) || privatePath(u.pathname)) return null;
    const tags = new URLSearchParams();
    for (const k of utmKeys) {
      const v = campaign(u.searchParams.get(k));
      if (v) tags.set(k, v);
    }
    return {
      ...event,
      url:
        u.origin +
        pathOnly(u.pathname) +
        (tags.size ? "?" + tags.toString() : ""),
    };
  } catch {
    return null;
  }
}
