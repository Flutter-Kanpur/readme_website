'use client';

import { useState, useRef } from 'react';
import Editor from "../components/Editor";
import ArticleSettings from "../components/ArticleSettings";
import Navbar from '../components/Navbar/Navbar';
import { supabase } from "@/app/lib/supabase";
import { resolveCoverImageUrl } from "@/app/lib/uploadCoverImage";
import './write.css';

export default function WritePage() {
  const [isAuthenticated] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState('');
  // Track the blog row id once we've inserted it. Subsequent Save / Publish
  // clicks UPDATE this row instead of inserting a new one — that's what
  // prevents duplicate draft entries when the user clicks Save Draft twice.
  const [draftId, setDraftId] = useState(null);

  // Combined "in-flight" flag — used to disable BOTH buttons during any
  // async write, so the user can't Publish while a Save Draft is pending
  // (and vice versa).
  const busy = saving || publishing;

  const editorDataRef = useRef({
    title: '',
    content: '',
    category: 'Technology',
    tags: [],
    coverImage: null
  });

  const updateEditorData = (data) => {
    editorDataRef.current = { ...editorDataRef.current, ...data };
  };

  // Shared write helper — INSERTs the first time, UPDATEs every time after.
  // Returns true on success so callers can drive their own UI feedback.
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

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
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
    };

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
      setDraftId(data.blog_id);
    }

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
              disabled={busy}
              aria-busy={publishing}
              className="write-publish-btn"
            >
              {publishing ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
