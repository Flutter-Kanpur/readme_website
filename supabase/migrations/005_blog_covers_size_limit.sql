-- Raise blog-covers bucket limit (optional safety net after client-side compression).
update storage.buckets
set file_size_limit = 10485760
where id = 'blog-covers';
