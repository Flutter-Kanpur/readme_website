'use client';

import { useEffect, useState } from 'react';
import useBlogSupport from '@/app/hooks/useBlogSupport';
import { getCachedLike, setCachedLike } from '@/app/lib/supabase/likeCache';
import { parseLikeCount } from '@/app/lib/supabase/likes';
import { parseViewCount } from '@/app/lib/supabase/views';
import './ArticleCardEngagement.css';

function formatCount(count) {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return String(count);
}

function HeartIcon({ filled }) {
  if (filled) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    );
  }
  return (
    <svg
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

function EyeIcon() {
  return (
    <svg
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
 * Compact Support + view count for list cards (matches Flutter compact mode).
 * Stops click propagation so parent Links do not navigate on Support tap.
 */
export default function ArticleCardEngagement({ article, blog }) {
  const row = article ?? blog;
  const blogId = row?.blog_id ?? null;
  const initialLikeCount = parseLikeCount(row);
  const viewCount = parseViewCount(row);
  const cached = blogId ? getCachedLike(blogId) : null;
  const [bounce, setBounce] = useState(false);

  const { likeCount, isLiked, isLoading, actionLoading, toggleSupport } =
    useBlogSupport(blogId, {
      initialLikeCount,
      initialIsLiked: cached,
      compact: true,
    });

  useEffect(() => {
    if (!blogId) return;
    setCachedLike(blogId, isLiked);
  }, [blogId, isLiked]);

  if (!blogId) return null;

  const handleSupport = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (actionLoading) return;
    if (!isLiked) {
      setBounce(true);
      window.setTimeout(() => setBounce(false), 280);
    }
    toggleSupport();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleSupport(event);
    }
  };

  return (
    <div
      className="article-card-engagement"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={handleKeyDown}
      role="group"
      aria-label="Article engagement"
    >
      <button
        type="button"
        className={`article-card-support${isLiked ? ' is-supported' : ''}`}
        onClick={handleSupport}
        disabled={actionLoading}
        aria-pressed={isLiked}
        aria-label={isLiked ? 'Remove support' : 'Support this article'}
      >
        <span className={`article-card-support__heart${bounce ? ' is-bounce' : ''}`}>
          <HeartIcon filled={isLiked} />
        </span>
        <span>{isLoading ? '—' : formatCount(likeCount)}</span>
      </button>

      <div className="article-card-views" aria-label={`${formatCount(viewCount)} views`}>
        <EyeIcon />
        <span>{formatCount(viewCount)}</span>
      </div>
    </div>
  );
}
