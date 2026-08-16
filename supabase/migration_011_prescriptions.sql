-- Run this in the Supabase SQL editor to create the prescription module.
--
-- Two tables: `prescriptions` (one per formulation, tied to a client) and
-- `prescription_items` (the individual herbs in that formulation).
--
-- Neither table has any anon policies — the public site never touches these.
-- All access happens through the /api serverless functions using the service
-- role key, gated by the back office password, exactly like orders.

create table if not exists prescriptions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Links to the client's intake submission. Kept as a nullable reference so
  -- a prescription is never silently deleted if a submission is removed.
  submission_id uuid references intake_submissions(id) on delete set null,

  -- Denormalised so prescriptions stay readable even if the link is lost
  client_name text,
  client_email text,

  -- Human-friendly reference, e.g. MH-0001
  reference text unique,

  formulation_type text,        -- tincture / fluid extract / dried / tea / cream
  total_volume_ml numeric,      -- total made up, e.g. 200
  dosage text,                  -- e.g. "5ml"
  frequency text,               -- e.g. "Three times daily"
  duration text,                -- e.g. "4 weeks"
  instructions text,            -- "Take with water before food"
  practitioner_notes text,      -- private clinical notes, not for the client

  status text not null default 'draft',   -- draft | issued | archived
  issued_date date,
  review_date date
);

create table if not exists prescription_items (
  id uuid primary key default gen_random_uuid(),
  prescription_id uuid not null references prescriptions(id) on delete cascade,
  herb_latin text,
  herb_common text,
  format text,                  -- tincture / fluid extract / dried
  quantity_ml numeric,          -- amount used in this formulation
  notes text,
  sort_order integer default 0
);

create index if not exists idx_prescription_items_prescription
  on prescription_items(prescription_id);
create index if not exists idx_prescriptions_submission
  on prescriptions(submission_id);

alter table prescriptions enable row level security;
alter table prescription_items enable row level security;

-- Clients can view their own issued prescriptions in the Members area.
-- Drafts and archived prescriptions stay hidden from them.
create policy "Clients can view their own issued prescriptions"
  on prescriptions for select
  to authenticated
  using (client_email = (auth.jwt() ->> 'email') and status = 'issued');

create policy "Clients can view items on their own issued prescriptions"
  on prescription_items for select
  to authenticated
  using (
    exists (
      select 1 from prescriptions p
      where p.id = prescription_items.prescription_id
        and p.client_email = (auth.jwt() ->> 'email')
        and p.status = 'issued'
    )
  );
