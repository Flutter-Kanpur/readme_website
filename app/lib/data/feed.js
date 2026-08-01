import { getLatestArticle } from '@/app/lib/supabase/queries';

/**
 * Feed budget: 1 blogs select (like_count + view_count columns, limit 20)
 * + 0–1 batched liked-IDs via likeCache preload.
 */
export const FEED_LIMIT = 20;

/**
 * Published feed for home / explore filters.
 * Thin wrapper — keep call sites off raw query details.
 */
export async function getFeed(category = 'for_you') {
  return getLatestArticle(category);
}
