-- Run this in the Supabase SQL editor to store the drawn signature.
-- Held as a PNG data URL alongside the typed name, so the consent record
-- has an actual handwritten mark rather than just typed text.

alter table intake_submissions
  add column if not exists signature_image text;
