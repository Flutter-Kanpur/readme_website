'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSafeUser } from '@/app/lib/supabase/auth';
import { likeComment, unlikeComment } from '@/app/lib/supabase/comments';
import { formatEngagementCount, formatRelativeTime } from '@/app/lib/utils/relativeTime';

function HeartIcon({ filled }) {
  if (filled) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="responses-action-icon" aria-hidden="true">
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
      className="responses-action-icon"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function CommentAvatar({ url, name }) {
  if (url) {
    return <img src={url} alt="" className="responses-avatar" />;
  }
  return (
    <div className="responses-avatar responses-avatar--placeholder" aria-hidden="true">
      {(name?.[0] ?? '?').toUpperCase()}
    </div>
  );
}

function CommentBody({ comment, onLikeChanged, onReplyTap, showReplyAction }) {
  return (
    <div className="responses-comment-body">
      <CommentAvatar url={comment.author.avatarUrl} name={comment.author.name} />
      <div className="responses-comment-main">
        <div className="responses-comment-header">
          <span className="responses-author-name">{comment.author.name}</span>
          <span className="responses-time">{formatRelativeTime(comment.createdAt)}</span>
        </div>
        <p className="responses-text">{comment.body}</p>
        <div className="responses-actions">
          <CommentLikeButton comment={comment} onLikeChanged={onLikeChanged} />
          {showReplyAction && (
            <button
              type="button"
              className="responses-reply-btn"
              onClick={onReplyTap}
              aria-label={`Reply to ${comment.author.name}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="responses-action-icon" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{formatEngagementCount(comment.replies?.length ?? 0)}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CommentLikeButton({ comment, onLikeChanged }) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(comment.isLiked);
  const [likeCount, setLikeCount] = useState(comment.likeCount);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (loading) return;

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
    const prev = likeCount;
    const nextLiked = !wasLiked;
    const nextCount = wasLiked ? Math.max(0, likeCount - 1) : likeCount + 1;

    setIsLiked(nextLiked);
    setLikeCount(nextCount);
    onLikeChanged(comment.id, nextLiked, nextCount);
    setLoading(true);

    try {
      if (wasLiked) {
        await unlikeComment(comment.id);
      } else {
        await likeComment(comment.id);
      }
    } catch (error) {
      setIsLiked(wasLiked);
      setLikeCount(prev);
      onLikeChanged(comment.id, wasLiked, prev);
      console.error('Comment like error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={`responses-like-btn${isLiked ? ' is-liked' : ''}`}
      onClick={toggle}
      disabled={loading}
      aria-pressed={isLiked}
    >
      <HeartIcon filled={isLiked} />
      <span>{formatEngagementCount(likeCount)}</span>
    </button>
  );
}

export default function CommentTile({
  comment,
  onLikeChanged,
  onReplyTap,
  isReply = false,
}) {
  const [repliesExpanded, setRepliesExpanded] = useState(false);
  const replyCount = comment.replies?.length ?? 0;

  if (isReply) {
    return (
      <CommentBody
        comment={comment}
        onLikeChanged={onLikeChanged}
        showReplyAction={false}
      />
    );
  }

  return (
    <article className="responses-tile">
      <CommentBody
        comment={comment}
        onLikeChanged={onLikeChanged}
        onReplyTap={onReplyTap}
        showReplyAction
      />
      {replyCount > 0 && (
        <button
          type="button"
          className="responses-toggle-replies"
          onClick={() => setRepliesExpanded((v) => !v)}
        >
          {repliesExpanded ? 'Hide replies' : `Show replies (${replyCount})`}
        </button>
      )}
      {replyCount > 0 && repliesExpanded && (
        <div className="responses-replies">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="responses-reply-item">
              <div className="responses-thread-line" aria-hidden="true" />
              <CommentTile
                comment={reply}
                onLikeChanged={onLikeChanged}
                isReply
              />
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
