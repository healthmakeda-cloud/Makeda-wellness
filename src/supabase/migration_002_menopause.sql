-- Run this in the Supabase SQL editor to add the new menopause fields
-- to a table created before this update. Safe to run even if you're
-- not sure — "if not exists" means it won't error if already applied.

alter table intake_submissions
  add column if not exists menopause_status text,
  add column if not exists menopause_symptoms jsonb default '[]';
