import { neon } from "@neondatabase/serverless";
import { createHash, timingSafeEqual } from "node:crypto";
import { analyticsSite } from "@/config/analytics";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
export async function GET(request: Request) {
  const expected = `Bearer ${process.env.CRON_SECRET ?? ""}`;
  const actual = request.headers.get("authorization") ?? "";
  if (
    !process.env.CRON_SECRET ||
    actual.length !== expected.length ||
    !timingSafeEqual(Buffer.from(actual), Buffer.from(expected))
  )
    return new Response("Unauthorized", { status: 401 });
  const url = process.env.DATABASE_URL;
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  if (
    !url ||
    !token ||
    !["https://us.i.posthog.com", "https://eu.i.posthog.com"].includes(
      host ?? "",
    )
  )
    return new Response("Reporting not configured", { status: 503 });
  const sql = neon(url);
  // Persistent daily totals survive removal of customer-linked source fields.
  try {
    const snapshot = new Date().toISOString();
    const rows = await sql`
      with requests as (
select order_ref::text as ref, created_at, request_source, 'order_interest' as outcome from orders where email !~* '@example[.](com|org|net)$' union all select id::text as ref, created_at, request_source, source || '_signup' as outcome from email_subscribers where not is_test
      ), grouped as (
        select (created_at at time zone 'UTC')::date as day, outcome,
          coalesce(request_source->>'source', 'unknown') as source,
          coalesce(request_source->>'evidence', 'unattributed') as evidence,
          count(distinct ref)::integer as requests
        from requests where created_at >= (now() at time zone 'UTC')::date - interval '89 days' and created_at < (now() at time zone 'UTC')::date
        group by 1, 2, 3, 4
      )
      insert into request_source_daily (day, outcome, source, evidence, requests, snapshot_at)
      select day, outcome, source, evidence, requests, ${snapshot}::timestamptz from grouped
      on conflict (day, outcome, source, evidence) do update set requests = excluded.requests, snapshot_at = excluded.snapshot_at
      returning day::text, outcome, source, evidence, requests, snapshot_at
    `;
    // Retention runs independently of analytics delivery.
    await sql`update orders set request_source = null where request_source is not null and created_at < now() - interval '90 days'`;
    await sql`update email_subscribers set request_source = null where request_source is not null and created_at < now() - interval '90 days'`;
    if (rows.length) {
      const response = await fetch(`${host}/batch/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(20000),
        body: JSON.stringify({
          api_key: token,
          batch: rows.map((row) => ({
            event: "request_source_daily_snapshot",
            timestamp: snapshot,
            properties: {
              ...row,
              snapshot_at: snapshot,
              site_id: analyticsSite.id,
              experiment_id: "GEO-2407",
              experiment_arm: analyticsSite.experimentArm,
              pair_id: analyticsSite.pairId,
              environment: process.env.VERCEL_ENV ?? "development",
              distinct_id: `aggregate:${analyticsSite.id}`,
              $process_person_profile: false,
              $geoip_disable: true,
              $ip: null,
              $insert_id: createHash("sha256")
                .update(JSON.stringify([analyticsSite.id, row, snapshot]))
                .digest("hex"),
            },
          })),
        }),
      });
      if (!response.ok) throw new Error("Aggregate delivery failed");
    }
    const health = await fetch(`${host}/capture/`, { method: "POST", headers: { "Content-Type": "application/json" }, signal: AbortSignal.timeout(10000), body: JSON.stringify({ api_key: token, event: "request_source_report_run", properties: { site_id: analyticsSite.id, snapshot_at: snapshot, bucket_count: rows.length, environment: process.env.VERCEL_ENV ?? "development", distinct_id: `aggregate:${analyticsSite.id}`, $process_person_profile: false, $geoip_disable: true, $ip: null } }) });
    if (!health.ok) throw new Error("Report health delivery failed");
    await sql`insert into request_source_report_health (id, last_success_at, bucket_count) values (1, now(), ${rows.length}) on conflict (id) do update set last_success_at = excluded.last_success_at, bucket_count = excluded.bucket_count`;
    return Response.json(
      { buckets: rows.length, snapshot_at: snapshot },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return new Response(
      "Source report failed; check deployment logs and report freshness",
      { status: 503 },
    );
  }
}
