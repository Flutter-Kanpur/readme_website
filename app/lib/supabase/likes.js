import { supabase } from './index';
import { getSafeUser } from './auth';

/** PostgrestError often logs as `{}` — read message/code explicitly. */
export function formatLikeError(error) {
  if (!error) return 'Unknown error';
  if (typeof error === 'string') return error;
  return error.message || error.details || error.hint || JSON.stringify(error);
}

export function isLikesUnavailable(error) {
  if (!error) return false;
  const code = error.code;
  const msg = (error.message || '').toLowerCase();
  return (
    code === 'PGRST205' ||
    code === '42P01' ||
    (msg.includes('blog_likes') &&
      (msg.includes('does not exist') ||
        msg.includes('schema cache') ||
        msg.includes('could not find')))
  );
}

const LIKES_SETUP_HINT =
  'Likes are not available yet. Ask an admin to run supabase/migrations/011_blog_likes.sql in Supabase.';

/** Parse like count from a blog row that may include `blog_likes (count)`. */
export function parseLikeCount(blog) {
  if (!blog) return 0;
  const direct = blog.like_count;
  if (typeof direct === 'number' && !Number.isNaN(direct)) return direct;
  if (typeof direct === 'string') return parseInt(direct, 10) || 0;

  const likes = blog.blog_likes;
  if (Array.isArray(likes) && likes.length > 0) {
    const first = likes[0];
    if (typeof first === 'number') return first;
    if (first && typeof first === 'object') {
      const count = first.count;
      if (typeof count === 'number' && !Number.isNaN(count)) return count;
      if (typeof count === 'string') return parseInt(count, 10) || 0;
    }
  }
  // Rare shape: { count: N } instead of [{ count: N }]
  if (likes && typeof likes === 'object' && !Array.isArray(likes)) {
    const count = likes.count;
    if (typeof count === 'number' && !Number.isNaN(count)) return count;
    if (typeof count === 'string') return parseInt(count, 10) || 0;
  }
  return 0;
}

export async function fetchLikeCount(blogId) {
  if (!blogId) return 0;

  const { count, error } = await supabase
    .from('blog_likes')
    .select('*', { count: 'exact', head: true })
    .eq('blog_id', blogId);

  if (error) {
    if (isLikesUnavailable(error)) return 0;
    throw error;
  }
  return count ?? 0;
}

export async function isLikedByUser(blogId, { user: providedUser } = {}) {
  if (!blogId) return false;

  const user = providedUser ?? (await getSafeUser());
  if (!user) return false;

  const { data, error } = await supabase
    .from('blog_likes')
    .select('id')
    .eq('blog_id', blogId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    if (isLikesUnavailable(error)) return false;
    throw error;
  }
  return Boolean(data);
}

export async function fetchLikedBlogIds(blogIds, { user: providedUser } = {}) {
  if (!blogIds?.length) return new Set();

  const user = providedUser ?? (await getSafeUser());
  if (!user) return new Set();

  const { data, error } = await supabase
    .from('blog_likes')
    .select('blog_id')
    .eq('user_id', user.id)
    .in('blog_id', blogIds);

  if (error) {
    if (isLikesUnavailable(error)) return new Set();
    throw error;
  }
  return new Set((data ?? []).map((row) => row.blog_id));
}

export async function likeBlog(blogId) {
  if (!blogId) throw new Error('Missing blog to like');

  const user = await getSafeUser();
  if (!user) throw new Error('NOT_AUTHENTICATED');

  const { error } = await supabase.from('blog_likes').insert({
    blog_id: blogId,
    user_id: user.id,
  });

  if (error) {
    if (isLikesUnavailable(error)) {
      throw new Error(LIKES_SETUP_HINT);
    }
    // Already liked — idempotent (e.g. liked on mobile, toggling on web).
    if (error.code === '23505') return;
    throw error;
  }
}

export async function unlikeBlog(blogId) {
  if (!blogId) throw new Error('Missing blog to unlike');

  const user = await getSafeUser();
  if (!user) throw new Error('NOT_AUTHENTICATED');

  const { error } = await supabase
    .from('blog_likes')
    .delete()
    .eq('blog_id', blogId)
    .eq('user_id', user.id);

  if (error) {
    if (isLikesUnavailable(error)) {
      throw new Error(LIKES_SETUP_HINT);
    }
    throw error;
  }
  // Zero rows deleted (already unliked) is OK.
}
