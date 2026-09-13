-- blogs.slug lookups (article detail pages) had no index, causing a full
-- table scan on every article view. Run once in Supabase SQL editor.
create index if not exists blogs_slug_idx on public.blogs (slug);
