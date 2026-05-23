-- Communities, members, blog community_id, and co-authors.
-- Run once in Supabase SQL editor, then reload API schema.

DO $$ BEGIN
  CREATE TYPE public.community_role AS ENUM ('admin', 'editor', 'contributor');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- Communities
-- ---------------------------------------------------------------------------
create table if not exists public.communities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  logo_url text,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists communities_slug_idx on public.communities (slug);

-- ---------------------------------------------------------------------------
-- Community members
-- ---------------------------------------------------------------------------
create table if not exists public.community_members (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.community_role not null default 'contributor',
  joined_at timestamptz not null default now(),
  unique (community_id, user_id)
);

create index if not exists community_members_community_idx on public.community_members (community_id);
create index if not exists community_members_user_idx on public.community_members (user_id);

-- ---------------------------------------------------------------------------
-- Blogs → optional community
-- ---------------------------------------------------------------------------
alter table public.blogs
  add column if not exists community_id uuid references public.communities(id) on delete set null;

create index if not exists blogs_community_id_idx on public.blogs (community_id);

-- ---------------------------------------------------------------------------
-- Co-authors
-- ---------------------------------------------------------------------------
create table if not exists public.blog_coauthors (
  id uuid primary key default gen_random_uuid(),
  blog_id uuid not null references public.blogs(blog_id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (blog_id, user_id)
);

create index if not exists blog_coauthors_blog_idx on public.blog_coauthors (blog_id);
create index if not exists blog_coauthors_user_idx on public.blog_coauthors (user_id);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.communities enable row level security;
alter table public.community_members enable row level security;
alter table public.blog_coauthors enable row level security;

drop policy if exists "communities_select" on public.communities;
create policy "communities_select" on public.communities
  for select using (true);

drop policy if exists "communities_insert" on public.communities;
create policy "communities_insert" on public.communities
  for insert with check (auth.uid() = created_by);

drop policy if exists "communities_update" on public.communities;
create policy "communities_update" on public.communities
  for update using (
    exists (
      select 1 from public.community_members cm
      where cm.community_id = communities.id
        and cm.user_id = auth.uid()
        and cm.role = 'admin'
    )
  );

drop policy if exists "community_members_select" on public.community_members;
create policy "community_members_select" on public.community_members
  for select using (true);

drop policy if exists "community_members_insert" on public.community_members;
create policy "community_members_insert" on public.community_members
  for insert with check (
    exists (
      select 1 from public.community_members cm
      where cm.community_id = community_members.community_id
        and cm.user_id = auth.uid()
        and cm.role = 'admin'
    )
    or (
      community_members.user_id = auth.uid()
      and community_members.role = 'admin'
      and not exists (
        select 1 from public.community_members cm2
        where cm2.community_id = community_members.community_id
      )
    )
  );

drop policy if exists "community_members_update" on public.community_members;
create policy "community_members_update" on public.community_members
  for update using (
    exists (
      select 1 from public.community_members cm
      where cm.community_id = community_members.community_id
        and cm.user_id = auth.uid()
        and cm.role = 'admin'
    )
  );

drop policy if exists "community_members_delete" on public.community_members;
create policy "community_members_delete" on public.community_members
  for delete using (
    exists (
      select 1 from public.community_members cm
      where cm.community_id = community_members.community_id
        and cm.user_id = auth.uid()
        and cm.role = 'admin'
    )
  );

drop policy if exists "blog_coauthors_select" on public.blog_coauthors;
create policy "blog_coauthors_select" on public.blog_coauthors
  for select using (true);

drop policy if exists "blog_coauthors_insert" on public.blog_coauthors;
create policy "blog_coauthors_insert" on public.blog_coauthors
  for insert with check (auth.uid() is not null);

drop policy if exists "blog_coauthors_delete" on public.blog_coauthors;
create policy "blog_coauthors_delete" on public.blog_coauthors
  for delete using (auth.uid() is not null);

-- ---------------------------------------------------------------------------
-- Seed: Flutter Kanpur (uses earliest profile as creator + admin)
-- ---------------------------------------------------------------------------
insert into public.communities (slug, name, description, created_by)
select
  'flutter-kanpur',
  'Flutter Kanpur',
  'A community for Flutter developers in Kanpur — workshops, blogs, and open source.',
  p.id
from public.profiles p
order by p.created_at asc nulls last
limit 1
on conflict (slug) do nothing;

insert into public.community_members (community_id, user_id, role)
select c.id, c.created_by, 'admin'::public.community_role
from public.communities c
where c.slug = 'flutter-kanpur'
on conflict (community_id, user_id) do nothing;
