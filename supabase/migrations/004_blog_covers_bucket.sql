-- Public bucket for blog cover images (used by app/lib/uploadCoverImage.js).
-- Paths: {user_id}/{timestamp}.{ext}

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-covers',
  'blog-covers',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "blog_covers_public_read" on storage.objects;
create policy "blog_covers_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'blog-covers');

drop policy if exists "blog_covers_auth_upload" on storage.objects;
create policy "blog_covers_auth_upload"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'blog-covers'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "blog_covers_auth_update" on storage.objects;
create policy "blog_covers_auth_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'blog-covers'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "blog_covers_auth_delete" on storage.objects;
create policy "blog_covers_auth_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'blog-covers'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
