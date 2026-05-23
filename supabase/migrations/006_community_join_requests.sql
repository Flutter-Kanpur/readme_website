-- Replace open self-join with admin-approved join requests.

DO $$ BEGIN
  CREATE TYPE public.join_request_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Remove instant self-join (from 003_community_self_join.sql).
drop policy if exists "community_members_self_join" on public.community_members;

-- ---------------------------------------------------------------------------
-- Join requests
-- ---------------------------------------------------------------------------
create table if not exists public.community_join_requests (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  requested_role public.community_role not null default 'contributor',
  status public.join_request_status not null default 'pending',
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint community_join_requests_role_check
    check (requested_role in ('contributor'::public.community_role, 'editor'::public.community_role))
);

create index if not exists community_join_requests_community_idx
  on public.community_join_requests (community_id);

create index if not exists community_join_requests_user_idx
  on public.community_join_requests (user_id);

create unique index if not exists community_join_requests_one_pending_per_user
  on public.community_join_requests (community_id, user_id)
  where status = 'pending';

alter table public.community_join_requests enable row level security;

drop policy if exists "community_join_requests_select" on public.community_join_requests;
create policy "community_join_requests_select" on public.community_join_requests
  for select using (
    auth.uid() = user_id
    or exists (
      select 1 from public.community_members cm
      where cm.community_id = community_join_requests.community_id
        and cm.user_id = auth.uid()
        and cm.role = 'admin'
    )
  );

drop policy if exists "community_join_requests_insert" on public.community_join_requests;
create policy "community_join_requests_insert" on public.community_join_requests
  for insert with check (
    auth.uid() = user_id
    and status = 'pending'::public.join_request_status
    and requested_role in ('contributor'::public.community_role, 'editor'::public.community_role)
    and not exists (
      select 1 from public.community_members cm
      where cm.community_id = community_join_requests.community_id
        and cm.user_id = auth.uid()
    )
  );

drop policy if exists "community_join_requests_update" on public.community_join_requests;
create policy "community_join_requests_update" on public.community_join_requests
  for update using (
    exists (
      select 1 from public.community_members cm
      where cm.community_id = community_join_requests.community_id
        and cm.user_id = auth.uid()
        and cm.role = 'admin'
    )
  );

drop policy if exists "community_join_requests_delete" on public.community_join_requests;
create policy "community_join_requests_delete" on public.community_join_requests
  for delete using (
    (auth.uid() = user_id and status = 'pending'::public.join_request_status)
    or exists (
      select 1 from public.community_members cm
      where cm.community_id = community_join_requests.community_id
        and cm.user_id = auth.uid()
        and cm.role = 'admin'
    )
  );
