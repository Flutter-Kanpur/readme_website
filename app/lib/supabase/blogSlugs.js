import { slugifyTitle } from '@/app/lib/blogSlug';

const SLUG_CHECK_BATCH = 20;

async function slugExists(supabase, slug, excludeBlogId) {
  let query = supabase.from('blogs').select('blog_id').eq('slug', slug).limit(1);
  if (excludeBlogId) {
    query = query.neq('blog_id', excludeBlogId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data?.length ?? 0) > 0;
}

/**
 * Generate a unique slug for publish/update.
 * Falls back to `article-{id-prefix}` when the title slugifies to empty.
 */
export async function resolveUniqueBlogSlug(
  supabase,
  title,
  { excludeBlogId, blogIdForFallback } = {},
) {
  let base = slugifyTitle(title);
  if (!base) {
    const prefix = blogIdForFallback
      ? String(blogIdForFallback).slice(0, 8)
      : Date.now().toString(36);
    base = `article-${prefix}`;
  }

  let candidate = base;
  let suffix = 2;

  while (await slugExists(supabase, candidate, excludeBlogId)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
    if (suffix > SLUG_CHECK_BATCH) {
      candidate = `${base}-${Date.now().toString(36)}`;
      break;
    }
  }

  return candidate;
}
