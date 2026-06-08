'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSafeUser } from '@/app/lib/supabase/auth';
import {
  followCommunity,
  unfollowCommunity,
  isFollowingCommunity,
  formatFollowError,
  isCommunityFollowsUnavailable,
} from '@/app/lib/supabase/communityFollows';

export default function useFollowCommunity(communityId, { onStatsChange } = {}) {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!communityId) {
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

        if (!user) {
          setIsFollowing(false);
          return;
        }

        const following = await isFollowingCommunity(communityId);
        if (!cancelled) setIsFollowing(following);
      } catch (error) {
        if (isCommunityFollowsUnavailable(error)) {
          console.warn(
            '[community_followers] Table not found. Run supabase/migrations/010_community_followers.sql in Supabase, then reload the API schema.',
          );
        } else {
          console.error('useFollowCommunity load error:', formatFollowError(error));
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
  }, [communityId]);

  const toggleFollow = useCallback(async () => {
    if (!communityId) return;

    if (!currentUserId) {
      router.push('/login');
      return;
    }

    const wasFollowing = isFollowing;
    setIsFollowing(!wasFollowing);
    setActionLoading(true);

    try {
      if (wasFollowing) {
        await unfollowCommunity(communityId);
      } else {
        await followCommunity(communityId);
      }
      onStatsChange?.(!wasFollowing);
    } catch (error) {
      console.error('toggleFollowCommunity error:', formatFollowError(error));
      setIsFollowing(wasFollowing);
      if (error?.message?.includes('not set up yet')) {
        alert(error.message);
      }
    } finally {
      setActionLoading(false);
    }
  }, [communityId, currentUserId, isFollowing, onStatsChange, router]);

  return {
    currentUserId,
    isFollowing,
    isLoading,
    actionLoading,
    toggleFollow,
  };
}
