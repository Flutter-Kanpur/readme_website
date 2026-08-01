import { getArticleWithAuthor } from '@/app/lib/supabase/queries';

/** Article detail budget: 1 blogs select including denormalized counters. */
export async function getArticle(blogId) {
  return getArticleWithAuthor(blogId);
}
