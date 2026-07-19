'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSafeUser } from '@/app/lib/supabase/auth';
import {
  fetchLikeCount,
  isLikedByUser,
  likeBlog,
  unlikeBlog,
  formatLikeError,
  isLikesUnavailable,
} from '@/app/lib/supabase/likes';

/**
 * Support (like) state for a blog — mirrors Flutter BlogSupportButton.
 *
 * List cards (compact): trust embedded like counts + likeCache to avoid
 * per-card Supabase round-trips (egress).
 * Detail (expanded): refresh count + liked state once.
 */
export default function useBlogSupport(
  blogId,
  {
    initialLikeCount = 0,
    initialIsLiked = null,
    compact = false,
    refreshCount = !compact,
  } = {},
) {
  const router = useRouter();
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(Boolean(initialIsLiked));
  const [isLoading, setIsLoading] = useState(
    !(compact && (initialIsLiked != null || !refreshCount)),
  );
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    setLikeCount(initialLikeCount);
  }, [initialLikeCount]);

  useEffect(() => {
    if (!blogId) {
      setIsLoading(false);
      return;
    }

    // Compact list cards: use SSR/list embeds + cache only (no N+1 egress).
    if (compact && !refreshCount) {
      setIsLiked(Boolean(initialIsLiked));
      setLikeCount(initialLikeCount);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const countPromise = refreshCount
          ? fetchLikeCount(blogId)
          : Promise.resolve(initialLikeCount);

        let user = null;
        try {
          user = await getSafeUser();
        } catch {
          user = null;
        }

        if (cancelled) return;

        if (initialIsLiked != null) {
          setIsLiked(Boolean(initialIsLiked));
        } else if (!user) {
          setIsLiked(false);
        } else {
          const liked = await isLikedByUser(blogId);
          if (!cancelled) setIsLiked(liked);
        }

        const count = await countPromise;
        if (!cancelled) setLikeCount(count);
      } catch (error) {
        if (isLikesUnavailable(error)) {
          console.warn(
            '[likes] Table not found. Run supabase/migrations/011_blog_likes.sql in Supabase.',
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
          setIsLiked(Boolean(initialIsLiked));
          setLikeCount(initialLikeCount);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [blogId, compact, initialIsLiked, initialLikeCount, refreshCount]);

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
    const previousCount = likeCount;

    setIsLiked(!wasLiked);
    setLikeCount(wasLiked ? Math.max(0, likeCount - 1) : likeCount + 1);
    setActionLoading(true);

    try {
      if (wasLiked) {
        await unlikeBlog(blogId);
      } else {
        await likeBlog(blogId);
      }
    } catch (error) {
      console.error('toggleSupport error:', formatLikeError(error));
      setIsLiked(wasLiked);
      setLikeCount(previousCount);
      if (error?.message?.includes('not set up yet')) {
        alert(error.message);
      }
    } finally {
      setActionLoading(false);
    }
  }, [actionLoading, blogId, isLiked, likeCount, router]);

  return {
    likeCount,
    isLiked,
    isLoading,
    actionLoading,
    toggleSupport,
  };
}
