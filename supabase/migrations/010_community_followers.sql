-- Community followers (users who follow a community for updates).
-- Prerequisites: run 001_follows.sql and 002_communities.sql first.
-- Run once in Supabase SQL editor, then reload API schema.

create table if not exists public.community_followers (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  follower_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (community_id, follower_id)
);

create index if not exists community_followers_community_idx
  on public.community_followers (community_id);

create index if not exists community_followers_follower_idx
  on public.community_followers (follower_id);

alter table public.community_followers enable row level security;

drop policy if exists "community_followers_select" on public.community_followers;
create policy "community_followers_select" on public.community_followers
  for select using (true);

drop policy if exists "community_followers_insert" on public.community_followers;
create policy "community_followers_insert" on public.community_followers
  for insert with check (auth.uid() = follower_id);

drop policy if exists "community_followers_delete" on public.community_followers;
create policy "community_followers_delete" on public.community_followers
  for delete using (auth.uid() = follower_id);
