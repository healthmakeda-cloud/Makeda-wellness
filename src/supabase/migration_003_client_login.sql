-- Run this in the Supabase SQL editor. Lets a logged-in client see only
-- the submission(s) matching their own email — never anyone else's.
-- The public "insert" policy from before is untouched.

create policy "Clients can view their own submissions"
  on intake_submissions for select
  to authenticated
  using (email = (auth.jwt() ->> 'email'));
