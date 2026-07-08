-- Run this once in the Supabase SQL editor for this project.
-- Creates the intake submissions table and locks it down so the public
-- anon key (used by the website) can only INSERT, never read data back.

create extension if not exists "pgcrypto";

create table if not exists intake_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  first_name text,
  surname text,
  dob date,
  sex text,
  address text,
  postcode text,
  email text,
  mobile text,
  landline text,

  gp_name text,
  gp_tel text,
  gp_address text,
  gp_postcode text,
  gp_contact_consent boolean,

  description_of_ailment text,
  existing_or_new text,
  medications text,
  surgeries_last_3_months text,

  respiratory_notes text,
  cardiovascular_notes text,
  cardiovascular_flags jsonb default '[]',
  genitourinary_notes text,
  genitourinary_flags jsonb default '[]',
  gastrointestinal_notes text,
  gastrointestinal_flags jsonb default '[]',
  dermatological_notes text,
  musculoskeletal_notes text,
  musculoskeletal_flags jsonb default '[]',

  women_painful_periods boolean,
  women_last_period_date date,
  women_vaginal_discharge boolean,
  women_thrush boolean,
  women_pregnant boolean,
  women_complicated_pregnancy boolean,

  bowel_daily boolean,
  bowel_number_per_day text,
  bowel_difficulty boolean,
  bowel_consistency text,
  bowel_flatulence boolean,

  diet_vegetarian_vegan boolean,
  diet_food_cravings boolean,
  diet_food_cravings_detail text,
  diet_daily_fluid_intake text,
  diet_eating_disorder boolean,

  consent_given boolean not null default false,
  signature text,
  signed_date date,

  status text not null default 'new'
);

alter table intake_submissions enable row level security;

-- Public website can only ever INSERT a new row.
create policy "Public can submit intake forms"
  on intake_submissions for insert
  to anon
  with check (true);

-- No SELECT/UPDATE/DELETE policy is created for anon — reads only ever
-- happen through the /api serverless functions using the service role key,
-- which bypasses RLS and is never exposed to the browser.
