/**
 * In-memory cache of liked blog IDs for the current user.
 * Avoids one Supabase query per list card (matches Flutter BlogLikeCache).
 */
const cache = {
  likedByBlogId: null,
  userId: null,
};

// Tracks a preloadLikedBlogIds() call while it's in flight, so cards that
// mount before it resolves can await it instead of firing their own query.
let pendingPreload = null; // { ids: Set<string>, promise: Promise<void> } | null

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

export function getPendingPreload(blogId) {
  return pendingPreload?.ids.has(blogId) ? pendingPreload.promise : null;
}

export function preloadLikedBlogIds(blogIds) {
  if (!blogIds?.length) {
    cache.likedByBlogId = {};
    return Promise.resolve();
  }

  const ids = new Set(blogIds);
  const promise = (async () => {
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

    const likedIds = await fetchLikedBlogIds(blogIds, { user });
    cache.userId = user.id;
    cache.likedByBlogId = Object.fromEntries(
      blogIds.map((id) => [id, likedIds.has(id)]),
    );
  })();

  pendingPreload = { ids, promise };
  promise.finally(() => {
    if (pendingPreload?.promise === promise) pendingPreload = null;
  });

  return promise;
}
