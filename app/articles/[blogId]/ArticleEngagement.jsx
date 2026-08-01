'use client';

import { useEffect, useRef, useState } from 'react';
import useBlogSupport from '@/app/hooks/useBlogSupport';
import { recordView } from '@/app/lib/supabase/views';
import { getCachedLike } from '@/app/lib/supabase/likeCache';
import {
  getEngagementCounts,
  setEngagementCounts,
} from '@/app/lib/engagementStore';

function formatCount(count) {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return String(count);
}

function HeartIcon({ filled, className }) {
  if (filled) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    );
  }
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function EyeIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/**
 * Article detail engagement: denormalized like_count + view increment.
 * No mount-time fetchLikeCount — list/detail share the same counters.
 */
export default function ArticleEngagement({
  blogId,
  initialLikeCount = 0,
  initialViewCount = 0,
}) {
  const stored = blogId ? getEngagementCounts(blogId) : null;
  const { likeCount, isLiked, isLoading, actionLoading, toggleSupport } =
    useBlogSupport(blogId, {
      initialLikeCount: stored?.likeCount ?? initialLikeCount,
      initialIsLiked: blogId ? getCachedLike(blogId) : null,
      compact: false,
    });
  const [viewCount, setViewCount] = useState(
    stored?.viewCount ?? initialViewCount,
  );
  const recordedRef = useRef(false);
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    if (!blogId) return;
    setEngagementCounts(blogId, {
      likeCount: stored?.likeCount ?? initialLikeCount,
      viewCount: stored?.viewCount ?? initialViewCount,
    });
  }, [blogId, initialLikeCount, initialViewCount, stored?.likeCount, stored?.viewCount]);

  useEffect(() => {
    if (!blogId || recordedRef.current) return;
    recordedRef.current = true;

    let cancelled = false;
    (async () => {
      const latest = await recordView(blogId);
      if (!cancelled && latest != null) {
        setViewCount(latest);
        setEngagementCounts(blogId, { viewCount: latest });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [blogId]);

  const handleSupport = () => {
    if (!isLiked) {
      setBounce(true);
      window.setTimeout(() => setBounce(false), 280);
    }
    toggleSupport();
  };

  const label = isLiked ? 'Supported' : 'Support';
  const countLabel = isLoading ? '' : ` · ${formatCount(likeCount)}`;
  const viewsLabel =
    viewCount === 1
      ? `${formatCount(viewCount)} view`
      : `${formatCount(viewCount)} views`;

  return (
    <div className="article-engagement" role="group" aria-label="Article engagement">
      <button
        type="button"
        className={`article-support-btn${isLiked ? ' is-supported' : ''}`}
        onClick={handleSupport}
        disabled={actionLoading}
        aria-pressed={isLiked}
        aria-label={isLiked ? 'Remove support' : 'Support this article'}
      >
        <span className={`article-support-heart${bounce ? ' is-bounce' : ''}`}>
          <HeartIcon filled={isLiked} className="article-support-icon" />
        </span>
        <span className="article-support-label">
          {label}
          {countLabel}
        </span>
      </button>

      <div className="article-view-count" aria-label={viewsLabel}>
        <EyeIcon className="article-view-icon" />
        <span>{viewsLabel}</span>
      </div>
    </div>
  );
}
