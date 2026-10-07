-- Nullable additive columns; historical attribution remains unknown.
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS attribution jsonb;
ALTER TABLE public.email_subscribers ADD COLUMN IF NOT EXISTS attribution jsonb;
