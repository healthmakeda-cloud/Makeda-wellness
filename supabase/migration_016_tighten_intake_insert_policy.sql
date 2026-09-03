-- Fixes the security warning Supabase's linter raised:
--   "Authenticated users can also submit intake forms" allowed ANY signed-in
--   user to insert a submission under ANY email address — not just their own.
--
-- This is safe to tighten now because the in-clinic form (where Makéda
-- submits on behalf of a client) has been moved to a secure server route
-- using the service role key, gated by the admin password — it no longer
-- depends on this policy at all.
--
-- After this migration: a signed-in client can only ever submit a form
-- under their own email address.

drop policy if exists "Authenticated users can also submit intake forms" on intake_submissions;

create policy "Authenticated users can submit their own intake form"
  on intake_submissions for insert
  to authenticated
  with check (email = (auth.jwt() ->> 'email'));
