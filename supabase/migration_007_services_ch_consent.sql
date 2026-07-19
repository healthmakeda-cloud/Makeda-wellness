-- Run this in the Supabase SQL editor to add the new fields for
-- service selection and the colon-hydrotherapy-specific consent.

alter table intake_submissions
  add column if not exists services_interested jsonb default '[]',
  add column if not exists ch_consent_given boolean default false;
