-- Adds several things in one pass:
--   1. Colonics session count (1 / 3 / 6 / custom) from the intake form
--   2. A form_type column so we know which form was used ('MH' or 'BAL')
--   3. Auto-generated reference numbers — MH-0001, BAL-0001 — regardless of
--      which of the three submission paths was used (public form, in-clinic
--      tab, or Baldwin's tab), via a database trigger so it can never be
--      skipped or duplicated
--   4. Dated clinical notes — replaces the single free-text note with a
--      list of {date, text} entries
--   5. Columns needed so clients can edit their own basic contact details

alter table intake_submissions
  add column if not exists colonics_session_count text,
  add column if not exists form_type text default 'MH',
  add column if not exists reference text unique,
  add column if not exists clinical_notes_log jsonb default '[]';

-- One sequence per prefix, so MH and BAL numbers don't share a counter
create sequence if not exists intake_ref_mh_seq start 1;
create sequence if not exists intake_ref_bal_seq start 1;

create or replace function generate_intake_reference()
returns trigger as $$
begin
  if new.reference is null then
    if new.form_type = 'BAL' then
      new.reference := 'BAL-' || lpad(nextval('intake_ref_bal_seq')::text, 4, '0');
    else
      new.reference := 'MH-' || lpad(nextval('intake_ref_mh_seq')::text, 4, '0');
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_intake_reference on intake_submissions;
create trigger set_intake_reference
  before insert on intake_submissions
  for each row
  execute function generate_intake_reference();

-- Lets a signed-in client update their own name and mobile number — but
-- not email (changing that would break the link to their own login, since
-- sign-in works by matching this email to their account) and nothing
-- clinical. A row-level policy alone only restricts WHICH row they can
-- touch, not which columns — so this also restricts the actual UPDATE
-- privilege to just these columns at the database level, meaning even a
-- direct API call couldn't touch anything else, regardless of what the
-- interface allows. Email changes go through the back office instead,
-- where they can be kept in sync with messages and prescriptions.
drop policy if exists "Clients can update their own contact details" on intake_submissions;
create policy "Clients can update their own contact details"
  on intake_submissions for update
  to authenticated
  using (email = (auth.jwt() ->> 'email'))
  with check (email = (auth.jwt() ->> 'email'));

revoke update on intake_submissions from authenticated;
grant update (first_name, surname, mobile) on intake_submissions to authenticated;
