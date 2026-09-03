-- Adds an ongoing clinical notes field per client, separate from any single
-- prescription's private notes — a running note Makéda can update over time
-- as she sees a client across multiple visits and formulations.

alter table intake_submissions
  add column if not exists clinical_notes text;
