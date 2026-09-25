create table if not exists subscribers (
 id bigint generated always as identity primary key,
 email text not null unique,
 created_at timestamptz not null default now(),
 consent_text text not null
);
alter table orders add column if not exists recipient_name text;
alter table orders add column if not exists recipient_email text;
