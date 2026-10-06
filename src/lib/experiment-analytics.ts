// Shared fleet tracking contract. Do not pass form values or customer identifiers.
export const analyticsConsentKey = "experiment-analytics-consent-v2";
export const analyticsCookie = "experiment_analytics_v2";
export const analyticsEvents = [
  "$pageview",
  "cta_clicked",
  "form_started",
  "form_submitted",
  "outbound_clicked",
  "trial_requested",
  "quote_requested",
  "preorder_saved",
  "order_intent_saved",
  "restock_signup_saved",
  "launch_signup_saved",
] as const;
export type AnalyticsEvent = (typeof analyticsEvents)[number];
export const propertyKeys = new Set([
  "token",
  "distinct_id",
  "$session_id",
  "$insert_id",
  "$current_url",
  "$pathname",
  "$host",
  "$referrer",
  "$referring_domain",
  "$device_type",
  "$browser",
  "$os",
  "$lib",
  "$lib_version",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "site_id",
  "site_type",
  "environment",
  "experiment_id",
  "experiment_arm",
  "pair_id",
  "destination_host",
  "destination_path",
  "form_type",
  "plan",
  "interval",
  "is_test",
  "$process_person_profile",
  "$geoip_disable",
  "$ip",
]);
export function safeCampaign(value: string | null): string | undefined {
  return value && /^[a-zA-Z0-9_ .-]{1,80}$/.test(value) ? value : undefined;
}
export function safePath(value: string): string {
  // Never send query strings, hashes, unsubscribe tokens, or email-shaped paths.
  const path = value.split(/[?#]/)[0];
  return path.includes("@") || /%40/i.test(path) || path.length > 250
    ? "/redacted"
    : path;
}
export function safeReferrer(value: string): string {
  try {
    const url = new URL(value);
    return /^https?:$/.test(url.protocol) ? url.origin : "";
  } catch {
    return "";
  }
}
export function allowedProperties(properties: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(properties).filter(([key]) => propertyKeys.has(key)),
  );
}
export function parseAnalyticsCookie(value?: string) {
  if (!value) return null;
  const parts = value.split(".");
  const uuid =
    /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
  return parts.length === 2 && parts.every((part) => uuid.test(part))
    ? { distinctId: parts[0], sessionId: parts[1] }
    : null;
}

/** Keep receipt/auth tokens and private confirmation routes out of performance telemetry. */
export function performanceEvent<T extends { url: string; route?: string }>(
  event: T,
): T | null {
  try {
    const url = new URL(event.url);
    if (
      !/^https?:$/.test(url.protocol) ||
      /\/(payment|confirmation|unsubscribe|receipt|account|login|auth)(\/|$)/i.test(
        url.pathname,
      )
    )
      return null;
    return {
      ...event,
      url: url.origin + safePath(url.pathname),
      ...(event.route ? { route: safePath(event.route) } : {}),
    };
  } catch {
    return null;
  }
}
