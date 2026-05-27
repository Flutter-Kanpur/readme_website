-- Community monthly newsletters.
-- - `community_newsletters`: posts written by a community admin/editor.
-- - `community_newsletter_subscribers`: opt-in list. Signed-in users link to
--   their profile id; guests subscribe with email only.

-- ---------------------------------------------------------------------------
-- Newsletters
-- ---------------------------------------------------------------------------
create table if not exists public.community_newsletters (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  title text not null,
  body text not null,
  author_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists community_newsletters_community_idx
  on public.community_newsletters (community_id, created_at desc);

alter table public.community_newsletters enable row level security;

-- Anyone can read newsletters (public archive on the community page).
drop policy if exists "community_newsletters_select" on public.community_newsletters;
create policy "community_newsletters_select" on public.community_newsletters
  for select using (true);

-- Only admins or editors of the community can write a newsletter.
drop policy if exists "community_newsletters_insert" on public.community_newsletters;
create policy "community_newsletters_insert" on public.community_newsletters
  for insert with check (
    auth.uid() = author_id
    and exists (
      select 1 from public.community_members cm
      where cm.community_id = community_newsletters.community_id
        and cm.user_id = auth.uid()
        and cm.role in ('admin'::public.community_role, 'editor'::public.community_role)
    )
  );

drop policy if exists "community_newsletters_update" on public.community_newsletters;
create policy "community_newsletters_update" on public.community_newsletters
  for update using (
    exists (
      select 1 from public.community_members cm
      where cm.community_id = community_newsletters.community_id
        and cm.user_id = auth.uid()
        and cm.role in ('admin'::public.community_role, 'editor'::public.community_role)
    )
  );

drop policy if exists "community_newsletters_delete" on public.community_newsletters;
create policy "community_newsletters_delete" on public.community_newsletters
  for delete using (
    exists (
      select 1 from public.community_members cm
      where cm.community_id = community_newsletters.community_id
        and cm.user_id = auth.uid()
        and cm.role = 'admin'
    )
  );

-- ---------------------------------------------------------------------------
-- Subscribers
-- ---------------------------------------------------------------------------
create table if not exists public.community_newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now(),
  constraint community_newsletter_subscribers_email_check
    check (char_length(email) >= 3 and email like '%@%.%'),
  constraint community_newsletter_subscribers_email_unique
    unique (community_id, email)
);

create index if not exists community_newsletter_subscribers_user_idx
  on public.community_newsletter_subscribers (community_id, user_id);

alter table public.community_newsletter_subscribers enable row level security;

-- A subscriber can read their own subscription. Community admins can read all
-- subscribers for the communities they manage (so they can see the audience).
drop policy if exists "community_newsletter_subscribers_select" on public.community_newsletter_subscribers;
create policy "community_newsletter_subscribers_select" on public.community_newsletter_subscribers
  for select using (
    auth.uid() = user_id
    or exists (
      select 1 from public.community_members cm
      where cm.community_id = community_newsletter_subscribers.community_id
        and cm.user_id = auth.uid()
        and cm.role = 'admin'
    )
  );

-- Anyone (including unauthenticated guests) can subscribe. When signed in,
-- the row's user_id must match auth.uid(); guests must leave it null.
drop policy if exists "community_newsletter_subscribers_insert" on public.community_newsletter_subscribers;
create policy "community_newsletter_subscribers_insert" on public.community_newsletter_subscribers
  for insert with check (
    (auth.uid() is null and user_id is null)
    or auth.uid() = user_id
  );

-- A subscriber can unsubscribe themselves; admins can also remove subscribers.
drop policy if exists "community_newsletter_subscribers_delete" on public.community_newsletter_subscribers;
create policy "community_newsletter_subscribers_delete" on public.community_newsletter_subscribers
  for delete using (
    auth.uid() = user_id
    or exists (
      select 1 from public.community_members cm
      where cm.community_id = community_newsletter_subscribers.community_id
        and cm.user_id = auth.uid()
        and cm.role = 'admin'
    )
  );
