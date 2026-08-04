'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSafeUser } from '@/app/lib/supabase/auth';
import {
  applyLikedState,
  collectCommentIds,
  fetchComments,
  fetchLikedCommentIds,
  postComment,
} from '@/app/lib/supabase/comments';
import CommentTile from './CommentTile';
import ReplyModal from './ReplyModal';

const MAX_LENGTH = 2000;

export default function ArticleResponsesSection({ blogId }) {
  const router = useRouter();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [draft, setDraft] = useState('');
  const [replyTarget, setReplyTarget] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const loadComments = useCallback(async () => {
    if (!blogId) return;
    setLoading(true);
    try {
      let list = await fetchComments(blogId);
      try {
        const user = await getSafeUser();
        if (user) {
          const likedIds = await fetchLikedCommentIds(collectCommentIds(list), { user });
          list = applyLikedState(list, likedIds);
        }
      } catch {
        /* anonymous */
      }
      setComments(list);
    } catch (error) {
      console.error('fetchComments error:', error);
    } finally {
      setLoading(false);
    }
  }, [blogId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleLikeChanged = (commentId, isLiked, likeCount) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, isLiked, likeCount };
        }
        return {
          ...comment,
          replies: comment.replies.map((reply) =>
            reply.id === commentId ? { ...reply, isLiked, likeCount } : reply,
          ),
        };
      }),
    );
  };

  const handlePost = async () => {
    const trimmed = draft.trim();
    if (!trimmed || posting) return;

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

    setPosting(true);
    try {
      await postComment(blogId, trimmed);
      setDraft('');
      await loadComments();
    } catch (error) {
      console.error('postComment error:', error);
      alert(error.message === 'NOT_AUTHENTICATED' ? 'Sign in to comment.' : 'Could not post response.');
    } finally {
      setPosting(false);
    }
  };

  const handleComposerFocus = async () => {
    try {
      const user = await getSafeUser();
      if (!user) router.push('/login');
    } catch {
      router.push('/login');
    }
  };

  return (
    <section className="article-responses" aria-label="Comments">
      <div className="responses-divider" />
      <div className="responses-header">
        <h2 className="responses-title">Comments</h2>
        <button
          type="button"
          className="responses-info-btn"
          onClick={() => setShowInfo(true)}
          aria-label="About comments"
        >
          i
        </button>
      </div>

      <div className="responses-composer">
        <textarea
          className="responses-textarea responses-textarea--composer"
          placeholder="Write a comment."
          value={draft}
          maxLength={MAX_LENGTH}
          rows={4}
          onFocus={handleComposerFocus}
          onChange={(e) => setDraft(e.target.value)}
        />
        <div className="responses-composer-actions">
          <button
            type="button"
            className="responses-post-link"
            onClick={handlePost}
            disabled={posting || !draft.trim()}
          >
            {posting ? 'Posting…' : 'Post'}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="responses-empty">Loading comments…</p>
      ) : comments.length === 0 ? (
        <p className="responses-empty">No comments yet. Share your thoughts.</p>
      ) : (
        <ul className="responses-list">
          {comments.map((comment) => (
            <li key={comment.id}>
              <CommentTile
                comment={comment}
                onLikeChanged={handleLikeChanged}
                onReplyTap={async () => {
                  try {
                    const user = await getSafeUser();
                    if (!user) {
                      router.push('/login');
                      return;
                    }
                    setReplyTarget(comment);
                  } catch {
                    router.push('/login');
                  }
                }}
              />
            </li>
          ))}
        </ul>
      )}

      {showInfo && (
        <div className="responses-modal-backdrop" role="presentation" onClick={() => setShowInfo(false)}>
          <div className="responses-info-dialog" role="dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Comments</h3>
            <p>
              Share thoughtful feedback and join the conversation. Please be respectful to
              authors and other readers.
            </p>
            <button type="button" className="responses-post-btn" onClick={() => setShowInfo(false)}>
              Got it
            </button>
          </div>
        </div>
      )}

      {replyTarget && (
        <ReplyModal
          blogId={blogId}
          parentComment={replyTarget}
          onClose={() => setReplyTarget(null)}
          onReplyPosted={loadComments}
        />
      )}
    </section>
  );
}
