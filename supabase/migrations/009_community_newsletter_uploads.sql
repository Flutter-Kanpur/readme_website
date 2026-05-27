-- Allow community newsletters to attach an uploaded file (e.g. a PDF) in
-- addition to (or instead of) the typed body. Adds the columns to the
-- existing table and creates the storage bucket + RLS policies for uploads.
--
-- Run AFTER 008_community_newsletters.sql.

-- ---------------------------------------------------------------------------
-- Columns on public.community_newsletters
-- ---------------------------------------------------------------------------
alter table public.community_newsletters
  add column if not exists file_url text,
  add column if not exists file_name text,
  add column if not exists file_size_bytes bigint;

-- The original 008 migration declared `body text not null`. Make it optional
-- now that an uploaded file can carry the issue on its own.
alter table public.community_newsletters
  alter column body drop not null;

-- A newsletter must have *something* — either a body or an attached file.
alter table public.community_newsletters
  drop constraint if exists community_newsletters_has_content;
alter table public.community_newsletters
  add constraint community_newsletters_has_content
  check (
    coalesce(nullif(btrim(body), ''), null) is not null
    or coalesce(nullif(btrim(file_url), ''), null) is not null
  );

-- ---------------------------------------------------------------------------
-- Storage bucket: community-newsletters
-- Path convention: {community_id}/{newsletter_uuid_or_timestamp}-{slug}.pdf
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'community-newsletters',
  'community-newsletters',
  true,
  20971520, -- 20 MB
  array[
    'application/pdf',
    'image/png',
    'image/jpeg'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public read so subscribers and visitors can download the file.
drop policy if exists "community_newsletters_public_read" on storage.objects;
create policy "community_newsletters_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'community-newsletters');

-- Only admins or editors of the matching community can upload.
-- The first folder segment in the object name must be the community_id.
drop policy if exists "community_newsletters_editor_upload" on storage.objects;
create policy "community_newsletters_editor_upload"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'community-newsletters'
    and exists (
      select 1 from public.community_members cm
      where cm.community_id = ((storage.foldername(name))[1])::uuid
        and cm.user_id = auth.uid()
        and cm.role in ('admin'::public.community_role, 'editor'::public.community_role)
    )
  );

drop policy if exists "community_newsletters_editor_update" on storage.objects;
create policy "community_newsletters_editor_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'community-newsletters'
    and exists (
      select 1 from public.community_members cm
      where cm.community_id = ((storage.foldername(name))[1])::uuid
        and cm.user_id = auth.uid()
        and cm.role in ('admin'::public.community_role, 'editor'::public.community_role)
    )
  );

-- Only admins of the community may delete uploaded files.
drop policy if exists "community_newsletters_admin_delete" on storage.objects;
create policy "community_newsletters_admin_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'community-newsletters'
    and exists (
      select 1 from public.community_members cm
      where cm.community_id = ((storage.foldername(name))[1])::uuid
        and cm.user_id = auth.uid()
        and cm.role = 'admin'
    )
  );
