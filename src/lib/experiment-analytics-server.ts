import { cookies } from "next/headers";
import { createHash } from "node:crypto";
import { analyticsSite } from "@/config/analytics";
import {
  analyticsCookie,
  parseAnalyticsCookie,
  allowedProperties,
  type AnalyticsEvent,
} from "@/lib/experiment-analytics";

/** Call only after a successful database/provider write, never from a success-page render.
 * Best effort: a bounded analytics failure must never change a saved request's outcome.
 */
export async function captureConversion(
  event: AnalyticsEvent,
  reference: string,
  properties: Record<string, unknown> = {},
) {
  try {
    const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    if (
      process.env.NEXT_PUBLIC_POSTHOG_ENABLED !== "true" ||
      !token ||
      !["https://us.i.posthog.com", "https://eu.i.posthog.com"].includes(
        host ?? "",
      )
    )
      return;
    const identity = parseAnalyticsCookie(
      (await cookies()).get(analyticsCookie)?.value,
    );
    if (!identity) return;
    const environment = process.env.VERCEL_ENV ?? "development";
    const response = await fetch(`${host}/capture/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: token,
        event,
        properties: {
          ...allowedProperties(properties),
          distinct_id: identity.distinctId,
          $session_id: identity.sessionId,
          $insert_id: createHash("sha256")
            .update(`${analyticsSite.id}:${event}:${reference}`)
            .digest("hex"),
          site_id: analyticsSite.id,
          site_type: analyticsSite.kind,
          experiment_id: "GEO-2407",
          experiment_arm: analyticsSite.experimentArm,
          pair_id: analyticsSite.pairId,
          environment,
          is_test: environment !== "production" || properties.is_test === true,
          $process_person_profile: false,
          $geoip_disable: true,
          $ip: null,
        },
      }),
      signal: AbortSignal.timeout(1500),
    });
    if (!response.ok)
      console.warn("[analytics] Event delivery failed:", response.status);
  } catch {
    console.warn(
      "[analytics] Event delivery unavailable; saved request unaffected.",
    );
  }
}
