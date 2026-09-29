-- Email list and contact form storage (GEO shared building blocks 1 and 2).
--
-- Additive only: creates tables if missing and never drops or alters data.
-- The legacy `subscribers` table is left in place; scripts/migrate-list.ts
-- copies its rows into email_subscribers.
--
-- Apply once: `bun run db:list`.

create table if not exists email_subscribers (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  email text not null,
  source text not null,
  product text,
  order_ref text,
  consent_text text not null,
  consent_version text not null,
  consented_at timestamptz not null default now(),
  status text not null default 'subscribed' check (status in ('subscribed','unsubscribed')),
  unsubscribe_token text not null unique,
  unsubscribed_at timestamptz,
  email_notified boolean not null default false,
  is_test boolean not null default false,
  created_at timestamptz not null default now(),
  -- NULLS NOT DISTINCT so newsletter rows (product null) still dedupe per email.
  unique nulls not distinct (brand, email, source, product)
);

create index if not exists email_subscribers_email_idx on email_subscribers (brand, email);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  name text not null,
  email text not null,
  topic text not null,
  message text not null,
  is_test boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_email_idx on contact_messages (email, created_at desc);
