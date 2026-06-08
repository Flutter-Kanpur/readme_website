import { supabase } from './index';
import { getSafeUser } from './auth';
import { formatFollowError, isFollowsUnavailable } from './follows';

export { formatFollowError };

export function isCommunityFollowsUnavailable(error) {
  return isFollowsUnavailable(error);
}

export async function followCommunity(communityId) {
  if (!communityId) throw new Error('Missing community to follow');

  const user = await getSafeUser();
  if (!user) throw new Error('NOT_AUTHENTICATED');

  const { error } = await supabase.from('community_followers').insert({
    community_id: communityId,
    follower_id: user.id,
  });

  if (error) {
    if (isCommunityFollowsUnavailable(error)) {
      throw new Error(
        'Community follows is not set up yet. Run supabase/migrations/010_community_followers.sql in the Supabase SQL editor.',
      );
    }
    if (error.code === '23505') return;
    throw error;
  }
}

export async function unfollowCommunity(communityId) {
  if (!communityId) throw new Error('Missing community to unfollow');

  const user = await getSafeUser();
  if (!user) throw new Error('NOT_AUTHENTICATED');

  const { error } = await supabase
    .from('community_followers')
    .delete()
    .eq('community_id', communityId)
    .eq('follower_id', user.id);

  if (error) {
    if (isCommunityFollowsUnavailable(error)) {
      throw new Error(
        'Community follows is not set up yet. Run supabase/migrations/010_community_followers.sql in the Supabase SQL editor.',
      );
    }
    throw error;
  }
}

export async function isFollowingCommunity(communityId) {
  if (!communityId) return false;

  const user = await getSafeUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('community_followers')
    .select('id')
    .eq('community_id', communityId)
    .eq('follower_id', user.id)
    .maybeSingle();

  if (error) {
    if (isCommunityFollowsUnavailable(error)) return false;
    throw error;
  }
  return Boolean(data);
}

export async function getCommunityFollowerCount(communityId) {
  if (!communityId) return 0;

  const { count, error } = await supabase
    .from('community_followers')
    .select('*', { count: 'exact', head: true })
    .eq('community_id', communityId);

  if (error) {
    if (isCommunityFollowsUnavailable(error)) return 0;
    throw error;
  }
  return count ?? 0;
}
