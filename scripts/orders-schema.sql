-- Orders captured at checkout.
--
-- Historical rows defaulted to 'pending_payment'. The application now writes
-- 'awaiting_restock' explicitly; existing rows and the legacy default are preserved.
--
-- No card data is stored here and none may be added.
--
-- This database is dedicated to Moravel Athletic (Vercel Neon store
-- `moravel-athletic-db`). Never point this at another brand's database.
--
-- Apply once: `bun run db:orders`.

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'pending_payment',

  -- One row per line item; rows from one checkout share order_ref.
  order_ref uuid not null,

  name text not null,
  email text not null,

  address1 text not null,
  address2 text,
  city text not null,
  state text not null,
  zip text not null,

  product text not null,
  size text not null,
  color text,
  quantity int not null default 1 check (quantity between 1 and 5),
  -- Whole US dollars, from the catalogue at the time of the order.
  unit_price int not null,

  source text not null default 'moravel-athletic'
);

create index if not exists orders_created_at_idx on orders (created_at desc);
create index if not exists orders_ref_idx on orders (order_ref);
create index if not exists orders_product_size_idx on orders (product, size);
