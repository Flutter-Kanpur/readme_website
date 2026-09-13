import { getLatestArticle } from '@/app/lib/supabase/queries';

/**
 * Feed budget: 1 blogs select (like_count + view_count columns, limit 20)
 * + 0–1 batched liked-IDs via likeCache preload.
 */
export const FEED_LIMIT = 20;

/** Home only teases the latest few — full browsing lives on /articles. */
export const HOME_FEED_LIMIT = 6;

/**
 * Published feed for home / explore filters.
 * Thin wrapper — keep call sites off raw query details.
 */
export async function getFeed(category = 'for_you', { limit } = {}) {
  return getLatestArticle(category, { limit });
}

/** Latest few articles for the homepage teaser (see HOME_FEED_LIMIT). */
export async function getHomeFeed() {
  return getFeed('for_you', { limit: HOME_FEED_LIMIT });
}
