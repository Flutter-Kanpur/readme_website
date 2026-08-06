'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { getSafeUser } from '@/app/lib/supabase/auth';
import {
  isLikedByUser,
  likeBlog,
  unlikeBlog,
  formatLikeError,
  isLikesUnavailable,
} from '@/app/lib/supabase/likes';
import { getCachedLike, setCachedLike } from '@/app/lib/supabase/likeCache';
import {
  getEngagementCounts,
  getEngagementVersion,
  setEngagementCounts,
  subscribeEngagement,
} from '@/app/lib/engagementStore';

function subscribeStore(onStoreChange) {
  return subscribeEngagement(() => onStoreChange());
}

function getStoreSnapshot() {
  return getEngagementVersion();
}

/**
 * Support (like) state for a blog — mirrors Flutter BlogSupportButton.
 *
 * List + detail both trust denormalized like_count (no mount-time recount).
 * Liked boolean: likeCache / optional one isLikedByUser when unknown.
 */
export default function useBlogSupport(
  blogId,
  {
    initialLikeCount = 0,
    initialIsLiked = null,
    compact = false,
  } = {},
) {
  const router = useRouter();
  // Re-render when any engagement store update fires (list/detail parity).
  useSyncExternalStore(subscribeStore, getStoreSnapshot, getStoreSnapshot);

  const stored = blogId ? getEngagementCounts(blogId) : null;
  const resolvedInitialCount = stored?.likeCount ?? initialLikeCount;
  const resolvedInitialLiked =
    initialIsLiked != null
      ? Boolean(initialIsLiked)
      : blogId
        ? getCachedLike(blogId)
        : null;

  const [likeCount, setLikeCount] = useState(resolvedInitialCount);
  const [isLiked, setIsLiked] = useState(Boolean(resolvedInitialLiked));
  const [likedLoaded, setLikedLoaded] = useState(resolvedInitialLiked != null);
  const [actionLoading, setActionLoading] = useState(false);

  const displayCount = stored?.likeCount ?? likeCount;

  useEffect(() => {
    if (!blogId) return;
    if (getEngagementCounts(blogId)?.likeCount == null) {
      setEngagementCounts(blogId, { likeCount: initialLikeCount });
    }
  }, [blogId, initialLikeCount]);

  useEffect(() => {
    if (!blogId || resolvedInitialLiked != null) {
      return undefined;
    }

    let cancelled = false;
    (async () => {
      try {
        let user = null;
        try {
          user = await getSafeUser();
        } catch {
          user = null;
        }
        if (cancelled) return;
        if (!user) {
          setIsLiked(false);
          setLikedLoaded(true);
          return;
        }
        const liked = await isLikedByUser(blogId, { user });
        if (!cancelled) {
          setIsLiked(liked);
          setCachedLike(blogId, liked);
          setLikedLoaded(true);
        }
      } catch (error) {
        if (isLikesUnavailable(error)) {
          console.warn(
            '[likes] Table not found. Run supabase migrations for blog_likes.',
          );
        } else {
          const msg = formatLikeError(error).toLowerCase();
          if (
            !msg.includes('auth session missing') &&
            !msg.includes('session missing')
          ) {
            console.error('useBlogSupport load error:', formatLikeError(error));
          }
        }
        if (!cancelled) {
          setIsLiked(false);
          setLikedLoaded(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [blogId, resolvedInitialLiked]);

  const toggleSupport = useCallback(async () => {
    if (!blogId || actionLoading) return;

    let user = null;
    try {
      user = await getSafeUser();
    } catch {
      user = null;
    }

    if (!user) {
      router.push('/login');
      return;
    }

    const wasLiked = isLiked;
    const previousCount = displayCount;
    const nextCount = wasLiked
      ? Math.max(0, displayCount - 1)
      : displayCount + 1;

    setIsLiked(!wasLiked);
    setLikeCount(nextCount);
    setCachedLike(blogId, !wasLiked);
    setEngagementCounts(blogId, { likeCount: nextCount });
    setActionLoading(true);

    try {
      if (wasLiked) {
        await unlikeBlog(blogId);
      } else {
        await likeBlog(blogId);
      }
    } catch (error) {
      console.error('toggleSupport error:', formatLikeError(error));

      // Duplicate like: keep UI liked and sync cache (already liked elsewhere).
      if (!wasLiked && error?.code === '23505') {
        setIsLiked(true);
        setCachedLike(blogId, true);
        setEngagementCounts(blogId, { likeCount: nextCount });
        return;
      }

      setIsLiked(wasLiked);
      setLikeCount(previousCount);
      setCachedLike(blogId, wasLiked);
      setEngagementCounts(blogId, { likeCount: previousCount });
    } finally {
      setActionLoading(false);
    }
  }, [actionLoading, blogId, displayCount, isLiked, router]);

  return {
    likeCount: displayCount,
    isLiked,
    isLoading: !compact && !likedLoaded,
    actionLoading,
    toggleSupport,
  };
}
