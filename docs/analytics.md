# Experiment analytics

PostHog tracks consenting visits using the common fleet contract. This document describes the code, not deployment status.

- Configure `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`, and `NEXT_PUBLIC_POSTHOG_ENABLED=true` in the deployment environment, then rebuild. Use the project's public ingestion token, never a personal access token.
- Each event includes `site_id`, `site_type`, `experiment_id=GEO-2407`, `environment`, and `is_test`. `experiment_arm` and `pair_id` use the assignments recorded in GEO-2407; publishers have no brand-pair assignment. Historical GEO-2078 events are unchanged.
- Analytics starts only after Allow analytics. Decline, GPC and Do Not Track prevent collection. Analytics settings allows withdrawal. Consent preference is local; identifiers are session-scoped and never shared across domains. Family sites require the adult-labelled consent choice.
- Pageviews include sanitized entry referrer and UTM source/medium/campaign/content/term. Arbitrary query strings, hashes and form values are not sent; only the explicitly allowed UTM labels are retained. Campaign values must be short, non-personal labels. No email/name/customer reference, replay, autocapture, surveys, advertising, identified profiles or error payloads.
- The SDK stores an anonymous ID in session storage after consent. A first-party, 30-minute `experiment_analytics_v3` cookie connects confirmed server events to the same visit. The consent choice is stored in local storage until changed/cleared. PostHog receives connection metadata; GeoIP enrichment is disabled.
- Events: `$pageview`, `cta_clicked` (link to a conversion route), `form_started` (first focus per form per page lifetime), `outbound_clicked` (destination host/path), and applicable saved conversion events. Conversions run only after database/provider success and use hashed deduplication IDs; rendering/reloading a confirmation never creates one.
- Conversion names: `quote_requested`, `trial_requested`, `preorder_saved`, `order_intent_saved`, `restock_signup_saved`, `launch_signup_saved`. These are intent/leads, not purchases or revenue. Tuppo emits only after its configured provider accepts the address; an unconfigured provider is not a conversion.
- Use `environment=production` and `is_test=false` for experiment reports. Test fixtures must use non-production environments. Staff should decline analytics/use browser privacy preferences. Known test-email submissions are additionally labelled where available. Bots/ad blockers/declined consent make these observed sessions, not a census of all requests.
- Compare consenting sessions and conversion rates within each pair over the same date range. Referrers/UTMs cannot prove unclicked AI mentions or causal GEO lift. Keep visibility/citation measurement separate.
- PostHog MCP (`https://mcp.posthog.com/mcp`) queries the project after a separate account connection. SDK credentials alone do not authorize analytics queries. Ask for source-by-site traffic and completed-conversion funnels; filter QA events.

Validation: test no traffic before consent or after withdrawal, pageview deduplication on navigation, absence of PII/query tokens, same-session source-to-conversion linkage, and failure isolation. A blocked analytics endpoint must not block forms.

## Vercel Pro monitoring update — 2026-10-06

- Free Speed Insights runs on production only, after the same explicit consent as PostHog. The updated notice includes Vercel performance measurement. The later attribution update below supersedes this rollout’s consent version. Current consent storage/cookie version 3 requires a fresh choice.
- `beforeSend` rechecks consent and browser privacy preferences, strips query strings/hashes, and excludes payment, confirmation, unsubscribe, receipt and account/auth routes. Withdrawal stops future telemetry, even if the script was already loaded.
- No Speed Insights Plus subscription is enabled. Free-tier reporting provides RES with a team-wide allocation; this is not a promise of detailed Core Web Vitals reporting.
- CTA link tracking covers pricing, start, contact (including /pages/contact), checkout, sign-up and preorder routes. Outbound review links remain tracked by destination host/path.
- `form_submitted` records an attempt after browser validation, not database success. Only the existing post-save conversion events count as completed intent outcomes.
- Hosting request/bot/error snapshots are collected separately by `../monitoring/collect.ts` from the workspace root. Unknown bot classification is not evidence of no crawling. Gist GEO's `what is {brand}` remains the recognition test.

## October 6 attribution update

Consent v3 adds Vercel Web Analytics and 90-day, same-browser first/latest/latest-known-non-direct attribution. It requests a fresh choice; DNT/GPC and decline disable it. The first-party attribution cookie is sent only to this site and cleared on withdrawal. Entry UTMs include source, medium, campaign, content and term; only bounded campaign labels, referrer origins and sanitized landing paths are retained. Internal navigation does not overwrite acquisition. Missing evidence is direct_unknown, never inferred AI. Cross-device/domain identity is not stitched.

Brand database submissions store an attribution JSON snapshot in the same write as the submission. Existing rows remain NULL. Re-subscriptions keep their original first touch and update the latest touch when consented attribution exists. Browser-provided attribution is unverified evidence, not proof of engine origin or payment. Database failure handling remains the existing submission behavior.

Publishers record article_viewed for recognized article routes, pageviews for all public routes, and outbound_clicked with destination and header/footer/content position. No publisher databases or experimental-brand placements were added. Vercel events exclude private routes and retain only allowed UTMs; PostHog receives no customer fields.

## Current-request sources

Prepared behind REQUEST_SOURCE_ENABLED (default off). US-only server validation, DNT/GPC and opt-out respected. No new browser storage or identifiers. Current request_source is separate from consented 90-day attribution. Run scripts/migrate-request-source.ts before deploying. Daily authenticated cron exports aggregate counts only and clears source fields after 90 days. Report query: docs/request-source-report.sql. Inkle/Jomli stay disabled pending audience review.

The daily job runs at 08:15 UTC with a Vercel-managed CRON_SECRET header. `request_source_daily_snapshot` contains aggregate counts only, and `request_source_report_run` records freshness even when counts are zero. A missing site or an export older than 36 hours requires investigation. Do not divide these request totals by consent-only visitors. Sources are observations, not verified identities or causal proof.

Dashboard: https://us.posthog.com/project/647412/dashboard/2179464
Review sites continue their existing opt-in page/article/outbound analytics; no customer database or cross-site visitor tracking is added.
