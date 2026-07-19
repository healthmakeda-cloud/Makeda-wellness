-- Likely fix for "There was a problem saving your form."
--
-- The original insert policy only granted permission to the "anon" role.
-- If someone had signed into Members (even earlier in the same browser
-- session) and then filled in a fresh intake form, Supabase sends that
-- request as "authenticated" instead of "anon" — which had no insert
-- permission at all, so the save was silently rejected by the database's
-- security rules. This adds the same permission for authenticated users.

create policy "Authenticated users can also submit intake forms"
  on intake_submissions for insert
  to authenticated
  with check (true);
