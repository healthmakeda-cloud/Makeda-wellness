-- Run this in the Supabase SQL editor to add the new Men's Health fields.

alter table intake_submissions
  add column if not exists men_prostate_problems boolean,
  add column if not exists men_testicular_pain boolean,
  add column if not exists men_erectile_difficulties boolean,
  add column if not exists men_low_libido boolean,
  add column if not exists men_fertility_concerns boolean;
