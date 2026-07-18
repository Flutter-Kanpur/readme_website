/**
 * In-memory cache of liked blog IDs for the current user.
 * Avoids one Supabase query per list card (matches Flutter BlogLikeCache).
 */
const cache = {
  likedByBlogId: null,
  userId: null,
};

export function getCachedLike(blogId) {
  if (!cache.likedByBlogId) return null;
  return cache.likedByBlogId[blogId] ?? false;
}

export function setCachedLike(blogId, liked) {
  if (!cache.likedByBlogId) cache.likedByBlogId = {};
  cache.likedByBlogId[blogId] = liked;
}

export function invalidateLikeCache() {
  cache.likedByBlogId = null;
  cache.userId = null;
}

export async function preloadLikedBlogIds(blogIds) {
  if (!blogIds?.length) {
    cache.likedByBlogId = {};
    return;
  }

  const { getSafeUser } = await import('./auth');
  const { fetchLikedBlogIds } = await import('./likes');

  let user = null;
  try {
    user = await getSafeUser();
  } catch {
    user = null;
  }

  if (!user) {
    cache.likedByBlogId = {};
    cache.userId = null;
    return;
  }

  const likedIds = await fetchLikedBlogIds(blogIds);
  cache.userId = user.id;
  cache.likedByBlogId = Object.fromEntries(
    blogIds.map((id) => [id, likedIds.has(id)]),
  );
}
