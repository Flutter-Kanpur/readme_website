'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import useFollowCommunity from '@/app/hooks/useFollowCommunity';

export default function CommunityProfileHero({
  community,
  slug,
  contributorCount,
  initialFollowerCount = 0,
  publishedCount,
}) {
  const [followerCount, setFollowerCount] = useState(initialFollowerCount);

  const handleStatsChange = useCallback((nowFollowing) => {
    setFollowerCount((count) =>
      nowFollowing ? count + 1 : Math.max(0, count - 1),
    );
  }, []);

  const { isFollowing, isLoading, actionLoading, toggleFollow } =
    useFollowCommunity(community.id, { onStatsChange: handleStatsChange });

  const contributorLabel =
    contributorCount === 1
      ? '1 Contributor'
      : `${contributorCount} Contributors`;

  const followerLabel =
    followerCount === 1 ? '1 Follower' : `${followerCount} Followers`;

  const publishedLabel =
    publishedCount === 1 ? '1 Article' : `${publishedCount} Articles`;

  return (
    <header className="community-profile__hero">
      <div className="community-profile__hero-row">
        {community.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={community.logo_url} alt="" className="community-profile__logo" />
        ) : (
          <div className="community-profile__logo community-profile__logo--placeholder">
            {community.name?.charAt(0) ?? 'C'}
          </div>
        )}
        <div className="community-profile__hero-text">
          <h1>{community.name}</h1>
          {community.description && <p>{community.description}</p>}
          <p className="community-profile__meta">
            {contributorLabel} · {followerLabel} · {publishedLabel}
          </p>
        </div>
      </div>

      <div className="community-profile__actions">
        <Link href={`/communities/${slug}/dashboard`} className="community-profile__btn">
          Community dashboard
        </Link>
        <Link
          href="/write"
          className="community-profile__btn community-profile__btn--secondary"
        >
          Write for community
        </Link>
        {!isLoading && (
          <button
            type="button"
            onClick={toggleFollow}
            disabled={actionLoading}
            className={`community-profile__btn${
              isFollowing ? ' community-profile__btn--secondary' : ''
            }`}
          >
            {actionLoading
              ? 'Updating…'
              : isFollowing
                ? 'Following'
                : 'Follow Community'}
          </button>
        )}
      </div>
    </header>
  );
}
