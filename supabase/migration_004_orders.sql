-- Run this in the Supabase SQL editor. Creates the orders table. Unlike
-- intake_submissions, the public site never writes to this table directly —
-- only the Stripe webhook does, using the service role key, which bypasses
-- RLS entirely. So no anon policies are needed at all here.

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  stripe_session_id text unique,
  product_id text,
  product_name text,
  amount_gbp numeric,
  customer_email text,
  status text not null default 'paid'
);

alter table orders enable row level security;
-- No policies added — anon has zero access. Reads happen only via the
-- /api/orders and /api/export-orders serverless functions (service role key).
