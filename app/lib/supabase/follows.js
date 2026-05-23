import { supabase } from './index';
import { getSafeUser } from './auth';

/** PostgrestError often logs as `{}` — read message/code explicitly. */
export function formatFollowError(error) {
  if (!error) return 'Unknown error';
  if (typeof error === 'string') return error;
  return error.message || error.details || error.hint || JSON.stringify(error);
}

export function isFollowsUnavailable(error) {
  if (!error) return false;
  const code = error.code;
  const msg = (error.message || '').toLowerCase();
  return (
    code === 'PGRST205' ||
    code === '42P01' ||
    msg.includes('does not exist') ||
    msg.includes('schema cache') ||
    msg.includes('could not find the table')
  );
}

export async function followUser(followingId) {
  if (!followingId) throw new Error('Missing author to follow');

  const user = await getSafeUser();
  if (!user) throw new Error('NOT_AUTHENTICATED');

  const { error } = await supabase.from('follows').insert({
    follower_id: user.id,
    following_id: followingId,
  });

  if (error) {
    if (isFollowsUnavailable(error)) {
      throw new Error(
        'Follows is not set up yet. Run supabase/migrations/001_follows.sql in the Supabase SQL editor.',
      );
    }
    // Already following — treat as success.
    if (error.code === '23505') return;
    throw error;
  }
}

export async function unfollowUser(followingId) {
  if (!followingId) throw new Error('Missing author to unfollow');

  const user = await getSafeUser();
  if (!user) throw new Error('NOT_AUTHENTICATED');

  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', user.id)
    .eq('following_id', followingId);

  if (error) {
    if (isFollowsUnavailable(error)) {
      throw new Error(
        'Follows is not set up yet. Run supabase/migrations/001_follows.sql in the Supabase SQL editor.',
      );
    }
    throw error;
  }
}

export async function isFollowing(followingId) {
  if (!followingId) return false;

  const user = await getSafeUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', user.id)
    .eq('following_id', followingId)
    .maybeSingle();

  if (error) {
    if (isFollowsUnavailable(error)) return false;
    throw error;
  }
  return Boolean(data);
}

export async function getFollowStats(userId) {
  if (!userId) return { followers: 0, following: 0 };

  const [followersResult, followingResult] = await Promise.all([
    supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', userId),
    supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', userId),
  ]);

  if (followersResult.error) {
    if (isFollowsUnavailable(followersResult.error)) {
      return { followers: 0, following: 0 };
    }
    throw followersResult.error;
  }
  if (followingResult.error) {
    if (isFollowsUnavailable(followingResult.error)) {
      return { followers: 0, following: 0 };
    }
    throw followingResult.error;
  }

  return {
    followers: followersResult.count ?? 0,
    following: followingResult.count ?? 0,
  };
}
