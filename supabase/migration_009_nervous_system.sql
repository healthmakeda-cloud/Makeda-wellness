-- Run this in the Supabase SQL editor to add the new Nervous System section.

alter table intake_submissions
  add column if not exists nervous_system_notes text;
