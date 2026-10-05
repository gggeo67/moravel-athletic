# Experiment analytics

PostHog tracks consenting visits using the common fleet contract. This document describes the code, not deployment status.

- Configure `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`, and `NEXT_PUBLIC_POSTHOG_ENABLED=true` in the deployment environment, then rebuild. Use the project's public ingestion token, never a personal access token.
- Each event includes `site_id`, `site_type`, `experiment_id=GEO-2078`, `environment`, and `is_test`. No control/treatment assignment is invented. Set confirmed assignment in reporting before comparison.
- Analytics starts only after Allow analytics. Decline, GPC and Do Not Track prevent collection. Analytics settings allows withdrawal. Consent preference is local; identifiers are session-scoped and never shared across domains. Family sites require the adult-labelled consent choice.
- Pageviews include sanitized entry referrer and UTM source/medium/campaign. Query strings, hashes and form values are not sent. Campaign values must be short, non-personal labels. No email/name/customer reference, replay, autocapture, surveys, advertising, identified profiles or error payloads.
- The SDK stores an anonymous ID in session storage after consent. A first-party, 30-minute `experiment_analytics` cookie connects confirmed server events to the same visit. The consent choice is stored in local storage until changed/cleared. PostHog receives connection metadata; GeoIP enrichment is disabled.
- Events: `$pageview`, `cta_clicked` (link to a conversion route), `form_started` (first focus per form per page lifetime), `outbound_clicked` (destination host/path), and applicable saved conversion events. Conversions run only after database/provider success and use hashed deduplication IDs; rendering/reloading a confirmation never creates one.
- Conversion names: `quote_requested`, `trial_requested`, `preorder_saved`, `order_intent_saved`, `restock_signup_saved`, `launch_signup_saved`. These are intent/leads, not purchases or revenue. Tuppo emits only after its configured provider accepts the address; an unconfigured provider is not a conversion.
- Use `environment=production` and `is_test=false` for experiment reports. Test fixtures must use non-production environments. Staff should decline analytics/use browser privacy preferences. Known test-email submissions are additionally labelled where available. Bots/ad blockers/declined consent make these observed sessions, not a census of all requests.
- Compare consenting sessions and conversion rates within each pair over the same date range. Referrers/UTMs cannot prove unclicked AI mentions or causal GEO lift. Keep visibility/citation measurement separate.
- PostHog MCP (`https://mcp.posthog.com/mcp`) queries the project after a separate account connection. SDK credentials alone do not authorize analytics queries. Ask for source-by-site traffic and completed-conversion funnels; filter QA events.

Validation: test no traffic before consent or after withdrawal, pageview deduplication on navigation, absence of PII/query tokens, same-session source-to-conversion linkage, and failure isolation. A blocked analytics endpoint must not block forms.
