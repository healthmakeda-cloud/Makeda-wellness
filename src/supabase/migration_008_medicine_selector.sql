-- Run this in the Supabase SQL editor to support the new categorized
-- medicine selector on the intake form. The old free-text "medications"
-- column is left in place (harmless, just unused going forward) so no
-- existing data is lost.

alter table intake_submissions
  add column if not exists medications_selected jsonb default '[]',
  add column if not exists medications_other text;
