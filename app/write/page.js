'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Editor from "../components/Editor";
import ArticleSettings from "../components/ArticleSettings";
import CommunityPublishSettings from "../components/CommunityPublishSettings";
import Navbar from '../components/Navbar/Navbar';
import { supabase } from "@/app/lib/supabase";
import { getSafeUser } from "@/app/lib/supabase/auth";
import {
  getUserCommunities,
  syncBlogCoauthors,
  canPublishInCommunity,
} from "@/app/lib/supabase/communities";
import { resolveCoverImageUrl } from "@/app/lib/uploadCoverImage";
import './write.css';

export default function WritePage() {
  const [isAuthenticated] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState('');
  const [draftId, setDraftId] = useState(null);
  const [communities, setCommunities] = useState([]);
  const [communityId, setCommunityId] = useState(null);
  const [coAuthorIds, setCoAuthorIds] = useState([]);

  const busy = saving || publishing;

  const editorDataRef = useRef({
    title: '',
    content: '',
    category: 'Technology',
    tags: [],
    coverImage: null,
  });

  const selectedCommunity = communities.find((c) => c.id === communityId);
  const canPublishCommunity =
    !communityId || canPublishInCommunity(selectedCommunity?.role);

  useEffect(() => {
    getSafeUser().then((user) => {
      if (!user) return;
      getUserCommunities(user.id)
        .then(setCommunities)
        .catch((err) => console.error('Load communities error:', err));
    });
  }, []);

  const updateEditorData = (data) => {
    editorDataRef.current = { ...editorDataRef.current, ...data };
  };

  const handleCommunityChange = useCallback(({ communityId: nextId, coAuthorIds: nextCoAuthors }) => {
    setCommunityId(nextId);
    setCoAuthorIds(nextCoAuthors ?? []);
  }, []);

  const persistBlog = async ({ isPublished }) => {
    const { title, content, category, coverImage, tags } = editorDataRef.current;

    if (!title.trim()) {
      setMessage('Please add a title');
      return false;
    }

    if (isPublished && !content.trim()) {
      setMessage('Please add some content');
      return false;
    }

    if (isPublished && communityId && !canPublishCommunity) {
      setMessage('Only editors and admins can publish for this community. Save as draft instead.');
      return false;
    }

    const user = await getSafeUser();
    if (!user) {
      setMessage('You must be logged in');
      return false;
    }

    const cover_image = await resolveCoverImageUrl(coverImage, user.id, supabase);

    const payload = {
      title: title.trim(),
      content,
      category,
      tags,
      cover_image,
      is_published: isPublished,
      community_id: communityId || null,
    };

    let blogId = draftId;

    if (draftId) {
      const { error } = await supabase
        .from('blogs')
        .update(payload)
        .eq('blog_id', draftId)
        .eq('author_id', user.id);
      if (error) throw error;
    } else {
      const { data, error } = await supabase
        .from('blogs')
        .insert([{ ...payload, author_id: user.id }])
        .select('blog_id')
        .single();
      if (error) throw error;
      blogId = data.blog_id;
      setDraftId(data.blog_id);
    }

    await syncBlogCoauthors(blogId, coAuthorIds, user.id);
    return true;
  };

  const handleSaveDraft = async () => {
    if (busy) return;
    if (!isAuthenticated) {
      setMessage('You must be authenticated to save drafts');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const ok = await persistBlog({ isPublished: false });
      if (ok) {
        setMessage('Draft saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      setMessage('Error saving draft: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (busy) return;
    if (!isAuthenticated) {
      setMessage('You must be authenticated to publish');
      return;
    }

    setPublishing(true);
    setMessage('');

    try {
      const ok = await persistBlog({ isPublished: true });
      if (ok) {
        setMessage('Published successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error publishing:', error);
      setMessage('Error publishing: ' + error.message);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="write-page">
      <Navbar />

      <div className="write-content">
        <div className="write-editor-section">
          <div className="write-editor-wrapper">
            <Editor onDataChange={updateEditorData} />
          </div>
        </div>

        <div className="write-sidebar">
          <CommunityPublishSettings
            communities={communities}
            communityId={communityId}
            coAuthorIds={coAuthorIds}
            onChange={handleCommunityChange}
          />
          <ArticleSettings onDataChange={updateEditorData} />
        </div>
      </div>

      <div className="write-footer">
        <div className="write-actions">
          {message && (
            <span className={`write-message ${message.includes('Error') ? 'write-message-error' : 'write-message-success'}`}>
              {message}
            </span>
          )}
          <div className="write-buttons">
            <button
              onClick={handleSaveDraft}
              disabled={busy}
              aria-busy={saving}
              className="write-draft-btn"
            >
              {saving ? 'Saving...' : draftId ? 'Update Draft' : 'Save Draft'}
            </button>
            <button
              onClick={handlePublish}
              disabled={busy || (communityId && !canPublishCommunity)}
              aria-busy={publishing}
              className="write-publish-btn"
              title={
                communityId && !canPublishCommunity
                  ? 'Contributors can only save drafts for communities'
                  : undefined
              }
            >
              {publishing ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
