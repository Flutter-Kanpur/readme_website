'use client';

import { useEffect, useState } from 'react';
import { getSafeUser } from '@/app/lib/supabase/auth';
import { postReply } from '@/app/lib/supabase/comments';

function CommentAvatar({ url, name }) {
  if (url) {
    return <img src={url} alt="" className="responses-avatar responses-avatar--sm" />;
  }
  return (
    <div className="responses-avatar responses-avatar--sm responses-avatar--placeholder" aria-hidden="true">
      {(name?.[0] ?? '?').toUpperCase()}
    </div>
  );
}

export default function ReplyModal({ blogId, parentComment, onClose, onReplyPosted }) {
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const maxLength = 2000;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const user = await getSafeUser();
        if (!user || cancelled) return;
        const { supabase } = await import('@/app/lib/supabase');
        const { data } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .maybeSingle();
        if (!cancelled) setAvatarUrl(data?.avatar_url ?? null);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const submit = async () => {
    const trimmed = body.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    try {
      await postReply(blogId, parentComment.id, trimmed);
      onReplyPosted();
      onClose();
    } catch (error) {
      console.error('Reply error:', error);
      alert(error.message === 'NOT_AUTHENTICATED' ? 'Sign in to reply.' : 'Could not post reply.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="responses-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="responses-modal"
        role="dialog"
        aria-labelledby="reply-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="responses-modal-handle" aria-hidden="true" />
        <div className="responses-modal-header">
          <h2 id="reply-modal-title" className="responses-modal-title">
            Post your reply
          </h2>
          <button type="button" className="responses-modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="responses-modal-parent">
          <CommentAvatar url={parentComment.author.avatarUrl} name={parentComment.author.name} />
          <div>
            <p className="responses-modal-parent-name">{parentComment.author.name}</p>
            <p className="responses-modal-parent-body">{parentComment.body}</p>
          </div>
        </div>
        <div className="responses-modal-compose">
          <CommentAvatar url={avatarUrl} name="You" />
          <textarea
            className="responses-textarea"
            placeholder="Write a reply"
            value={body}
            maxLength={maxLength}
            rows={4}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
        <div className="responses-modal-actions">
          <button
            type="button"
            className="responses-post-btn"
            onClick={submit}
            disabled={submitting || !body.trim()}
          >
            {submitting ? 'Posting…' : 'Reply'}
          </button>
        </div>
      </div>
    </div>
  );
}
