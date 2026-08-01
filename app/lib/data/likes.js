import { getSafeUser } from '@/app/lib/supabase/auth';
import { fetchLikedBlogIds } from '@/app/lib/supabase/likes';

/**
 * One auth check + one `.in()` query for liked state across a list.
 */
export async function getLikedSet(blogIds) {
  if (!blogIds?.length) return new Set();

  let user = null;
  try {
    user = await getSafeUser();
  } catch {
    user = null;
  }
  if (!user) return new Set();

  return fetchLikedBlogIds(blogIds, { user });
}
