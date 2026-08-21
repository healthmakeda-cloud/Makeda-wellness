-- Run this in the Supabase SQL editor to create the messaging system.
--
-- Messages are tied to a client's intake submission, so the whole
-- conversation sits alongside their clinical record.

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  submission_id uuid references intake_submissions(id) on delete cascade,
  client_email text not null,

  -- 'practitioner' or 'client' — who wrote it
  sender text not null,
  sender_name text,

  body text not null,

  -- Lets each side see what the other hasn't read yet
  read_by_client boolean not null default false,
  read_by_practitioner boolean not null default false
);

create index if not exists idx_messages_submission on messages(submission_id);
create index if not exists idx_messages_client_email on messages(client_email);

alter table messages enable row level security;

-- Clients can read their own thread
create policy "Clients can read their own messages"
  on messages for select
  to authenticated
  using (client_email = (auth.jwt() ->> 'email'));

-- Clients can write, but only as themselves and only as 'client'
create policy "Clients can send their own messages"
  on messages for insert
  to authenticated
  with check (
    client_email = (auth.jwt() ->> 'email')
    and sender = 'client'
  );

-- Clients can mark practitioner messages as read
create policy "Clients can mark messages read"
  on messages for update
  to authenticated
  using (client_email = (auth.jwt() ->> 'email'))
  with check (client_email = (auth.jwt() ->> 'email'));

-- The practitioner side goes through /api using the service role key,
-- which bypasses RLS entirely — no policy needed for that.
