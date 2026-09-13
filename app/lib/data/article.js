import { cache } from 'react';
import { getArticleWithAuthor } from '@/app/lib/supabase/queries';

/**
 * Article detail budget: 1 blogs select including denormalized counters.
 * cache() dedupes generateMetadata + the page component's calls within a
 * single request into one Supabase query.
 */
export const getArticle = cache(async function getArticle(blogId) {
  return getArticleWithAuthor(blogId);
});
