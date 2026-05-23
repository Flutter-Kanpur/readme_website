-- Follow relationships between profiles.
-- Run once in the Supabase SQL editor.

create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (follower_id, following_id),
  check (follower_id <> following_id)
);

create index if not exists follows_follower_id_idx on public.follows (follower_id);
create index if not exists follows_following_id_idx on public.follows (following_id);

alter table public.follows enable row level security;

drop policy if exists "follows_select" on public.follows;
create policy "follows_select" on public.follows
  for select using (true);

drop policy if exists "follows_insert" on public.follows;
create policy "follows_insert" on public.follows
  for insert with check (auth.uid() = follower_id);

drop policy if exists "follows_delete" on public.follows;
create policy "follows_delete" on public.follows
  for delete using (auth.uid() = follower_id);
