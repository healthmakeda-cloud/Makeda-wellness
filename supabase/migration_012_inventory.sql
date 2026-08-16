-- Run this in the Supabase SQL editor to create the inventory module.
--
-- Three tables:
--   herb_stock       — one row per herb+format Makéda holds (the "product")
--   herb_batches     — each delivery, with its own batch no. and sell-by date
--   stock_movements  — an audit trail of every change in quantity
--
-- No anon policies at all — inventory is practitioner-only, accessed solely
-- through /api serverless functions using the service role key.

create table if not exists herb_stock (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  herb_latin text not null,
  herb_common text,
  format text not null,              -- Tincture / Fluid extract / Dried / Powder ...
  unit text not null default 'ml',   -- 'ml' for liquids, 'g' for dried herbs

  -- Makéda sets this per herb; it can differ between herbs and be changed
  -- as stock levels and supplier lead times change.
  low_stock_threshold numeric default 0,

  supplier text,
  notes text,

  -- A herb can be held in more than one format, so uniqueness is on the pair.
  unique (herb_latin, format)
);

create table if not exists herb_batches (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  stock_id uuid not null references herb_stock(id) on delete cascade,

  batch_number text,
  supplier text,
  purchase_date date,
  sell_by_date date,

  quantity_received numeric not null default 0,
  quantity_remaining numeric not null default 0,

  cost numeric,
  notes text,
  status text not null default 'active'   -- active | finished | expired
);

create table if not exists stock_movements (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  stock_id uuid references herb_stock(id) on delete set null,
  batch_id uuid references herb_batches(id) on delete set null,

  -- Negative for usage, positive for a delivery or correction upward
  quantity_change numeric not null,
  movement_type text not null,        -- delivery | prescription | adjustment | waste

  -- Traceability: which prescription consumed this, and who recorded it
  prescription_id uuid references prescriptions(id) on delete set null,
  client_name text,
  practitioner text,
  notes text
);

create index if not exists idx_herb_batches_stock on herb_batches(stock_id);
create index if not exists idx_stock_movements_stock on stock_movements(stock_id);
create index if not exists idx_stock_movements_prescription on stock_movements(prescription_id);

alter table herb_stock enable row level security;
alter table herb_batches enable row level security;
alter table stock_movements enable row level security;
-- No policies: practitioner-only, via service role key.

-- Tracks whether a prescription has already had its stock deducted, so
-- marking one "made up" twice can't double-deduct.
alter table prescriptions
  add column if not exists stock_deducted boolean not null default false;
