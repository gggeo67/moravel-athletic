-- Use latest bucket snapshots; never count exported events as requests.
SELECT site_id, day, outcome, source, evidence, sum(requests) AS requests
FROM (
 SELECT properties.site_id AS site_id, properties.day AS day,
 properties.outcome AS outcome, properties.source AS source, properties.evidence AS evidence,
 argMax(toInt(properties.requests), toDateTime(properties.snapshot_at)) AS requests
 FROM events WHERE event = 'request_source_daily_snapshot' AND properties.environment = 'production'
 GROUP BY site_id, day, outcome, source, evidence
)
GROUP BY site_id, day, outcome, source, evidence
ORDER BY day DESC, site_id, requests DESC
