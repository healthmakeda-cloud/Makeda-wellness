-- Run this in the Supabase SQL editor to add the Nervous System rating scales.

alter table intake_submissions
  add column if not exists stress_level integer,
  add column if not exists happiness_level integer,
  add column if not exists peacefulness_level integer;
