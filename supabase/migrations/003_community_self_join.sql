-- Allow logged-in users to join a community as contributor (open join for MVP).
-- Admins can still invite editors/admins via the dashboard.

drop policy if exists "community_members_self_join" on public.community_members;
create policy "community_members_self_join" on public.community_members
  for insert with check (
    auth.uid() = user_id
    and role = 'contributor'::public.community_role
  );

-- Community creator can grant themselves admin if not already a member.
drop policy if exists "community_members_creator_admin" on public.community_members;
create policy "community_members_creator_admin" on public.community_members
  for insert with check (
    auth.uid() = user_id
    and role = 'admin'::public.community_role
    and exists (
      select 1 from public.communities c
      where c.id = community_id
        and c.created_by = auth.uid()
    )
  );
