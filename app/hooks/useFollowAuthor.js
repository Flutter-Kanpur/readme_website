'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSafeUser } from '@/app/lib/supabase/auth';
import {
  followUser,
  unfollowUser,
  isFollowing as checkIsFollowing,
  formatFollowError,
  isFollowsUnavailable,
} from '@/app/lib/supabase/follows';

export default function useFollowAuthor(authorId, { onStatsChange } = {}) {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const isSelf = Boolean(
    currentUserId && authorId && currentUserId === authorId,
  );

  useEffect(() => {
    if (!authorId) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        let user = null;
        try {
          user = await getSafeUser();
        } catch {
          user = null;
        }
        if (cancelled) return;

        setCurrentUserId(user?.id ?? null);

        if (!user || user.id === authorId) {
          setIsFollowing(false);
          return;
        }

        const following = await checkIsFollowing(authorId);
        if (!cancelled) setIsFollowing(following);
      } catch (error) {
        if (isFollowsUnavailable(error)) {
          console.warn(
            '[follows] Table not found. Run supabase/migrations/001_follows.sql in Supabase, then reload the API schema.',
          );
        } else {
          console.error('useFollowAuthor load error:', formatFollowError(error));
        }
        if (!cancelled) setIsFollowing(false);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [authorId]);

  const toggleFollow = useCallback(async () => {
    if (!authorId || isSelf) return;

    if (!currentUserId) {
      router.push('/login');
      return;
    }

    const wasFollowing = isFollowing;
    setIsFollowing(!wasFollowing);
    setActionLoading(true);

    try {
      if (wasFollowing) {
        await unfollowUser(authorId);
      } else {
        await followUser(authorId);
      }
      onStatsChange?.();
    } catch (error) {
      console.error('toggleFollow error:', formatFollowError(error));
      setIsFollowing(wasFollowing);
      if (error?.message?.includes('not set up yet')) {
        alert(error.message);
      }
    } finally {
      setActionLoading(false);
    }
  }, [authorId, currentUserId, isFollowing, isSelf, onStatsChange, router]);

  return {
    currentUserId,
    isFollowing,
    isLoading,
    isSelf,
    actionLoading,
    toggleFollow,
  };
}
