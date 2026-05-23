-- Public bucket for community logos (used by app/lib/uploadCommunityLogo.js).
-- Paths: {community_id}/logo.jpg

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'community-logos',
  'community-logos',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "community_logos_public_read" on storage.objects;
create policy "community_logos_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'community-logos');

drop policy if exists "community_logos_admin_upload" on storage.objects;
create policy "community_logos_admin_upload"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'community-logos'
    and exists (
      select 1 from public.community_members cm
      where cm.community_id = ((storage.foldername(name))[1])::uuid
        and cm.user_id = auth.uid()
        and cm.role = 'admin'
    )
  );

drop policy if exists "community_logos_admin_update" on storage.objects;
create policy "community_logos_admin_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'community-logos'
    and exists (
      select 1 from public.community_members cm
      where cm.community_id = ((storage.foldername(name))[1])::uuid
        and cm.user_id = auth.uid()
        and cm.role = 'admin'
    )
  );

drop policy if exists "community_logos_admin_delete" on storage.objects;
create policy "community_logos_admin_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'community-logos'
    and exists (
      select 1 from public.community_members cm
      where cm.community_id = ((storage.foldername(name))[1])::uuid
        and cm.user_id = auth.uid()
        and cm.role = 'admin'
    )
  );
