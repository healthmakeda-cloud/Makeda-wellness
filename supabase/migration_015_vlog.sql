-- Run this in the Supabase SQL editor to create the vlog.
--
-- Posts can be public (anyone) or members-only (signed-in clients),
-- and stay hidden entirely until published.

create table if not exists vlog_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  title text not null,
  slug text unique,
  excerpt text,
  body text,

  -- A YouTube or Vimeo link; the page embeds it automatically
  video_url text,
  thumbnail_url text,

  category text,
  visibility text not null default 'public',   -- public | members
  status text not null default 'draft',        -- draft | published
  published_date date
);

create index if not exists idx_vlog_status on vlog_posts(status, visibility);

alter table vlog_posts enable row level security;

-- Anyone can read published public posts
create policy "Anyone can read published public posts"
  on vlog_posts for select
  to anon
  using (status = 'published' and visibility = 'public');

-- Signed-in clients can read all published posts, including members-only
create policy "Members can read all published posts"
  on vlog_posts for select
  to authenticated
  using (status = 'published');

-- Writing happens only through /api with the service role key.
