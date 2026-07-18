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
 * Auth-gated; redirects to /login when unauthenticated.
 */
export default function useBlogSupport(
  blogId,
  { initialLikeCount = 0, initialIsLiked = null, compact = false } = {},
) {
  const router = useRouter();
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(Boolean(initialIsLiked));
  const [isLoading, setIsLoading] = useState(
    !(compact && initialIsLiked != null),
  );
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!blogId) {
      setIsLoading(false);
      return;
    }

    if (compact && initialIsLiked != null) {
      setLikeCount(initialLikeCount);
      setIsLiked(Boolean(initialIsLiked));
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        if (compact) {
          let user = null;
          try {
            user = await getSafeUser();
          } catch {
            user = null;
          }
          if (cancelled) return;
          if (!user) {
            setIsLiked(false);
            return;
          }
          const liked = await isLikedByUser(blogId);
          if (!cancelled) setIsLiked(liked);
          return;
        }

        const [count, liked] = await Promise.all([
          fetchLikeCount(blogId),
          isLikedByUser(blogId),
        ]);
        if (cancelled) return;
        setLikeCount(count);
        setIsLiked(liked);
      } catch (error) {
        if (isLikesUnavailable(error)) {
          console.warn(
            '[likes] Table not found. Run supabase/migrations/011_blog_likes.sql in Supabase.',
          );
        } else {
          console.error('useBlogSupport load error:', formatLikeError(error));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [blogId, compact, initialIsLiked, initialLikeCount]);

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
    setLikeCount(
      wasLiked ? Math.max(0, likeCount - 1) : likeCount + 1,
    );
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
