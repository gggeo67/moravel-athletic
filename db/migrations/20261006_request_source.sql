ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS request_source jsonb;
ALTER TABLE public.email_subscribers ADD COLUMN IF NOT EXISTS request_source jsonb;
CREATE TABLE IF NOT EXISTS public.request_source_daily (
 day date NOT NULL, outcome text NOT NULL, source text NOT NULL, evidence text NOT NULL,
 requests integer NOT NULL CHECK (requests >= 0), snapshot_at timestamptz NOT NULL,
 PRIMARY KEY (day, outcome, source, evidence)
);
CREATE TABLE IF NOT EXISTS public.request_source_report_health (
 id integer PRIMARY KEY CHECK (id = 1), last_success_at timestamptz NOT NULL, bucket_count integer NOT NULL
);
