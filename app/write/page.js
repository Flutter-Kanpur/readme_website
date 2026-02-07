'use client';

import { useState, useRef } from 'react';
import Editor from "../components/Editor";
import ArticleSettings from "../components/ArticleSettings";
import Navbar from '../components/Navbar/Navbar';
import { supabase } from "@/lib/supabase";
import './write.css';

export default function WritePage() {
  const [isAuthenticated] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState('');
  
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

  const handleSaveDraft = async () => {
    if (!isAuthenticated) {
      setMessage('You must be authenticated to save drafts');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const { title, content, category, coverImage } = editorDataRef.current;

      if (!title.trim()) {
        setMessage('Please add a title');
        setSaving(false);
        return;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        setMessage('You must be logged in to save drafts');
        setSaving(false);
        return;
      }

      const { data, error } = await supabase
        .from('blogs')
        .insert([
          {
            title: title.trim(),
            content: content,
            category: category,
            cover_image: coverImage,
            is_published: false,
            author_id: user.id
          }
        ])
        .select();

      if (error) throw error;

      setMessage('Draft saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving draft:', error);
      setMessage('Error saving draft: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!isAuthenticated) {
      setMessage('You must be authenticated to publish');
      return;
    }

    setPublishing(true);
    setMessage('');

    try {
      const { title, content, category, coverImage } = editorDataRef.current;

      if (!title.trim()) {
        setMessage('Please add a title');
        setPublishing(false);
        return;
      }

      if (!content.trim()) {
        setMessage('Please add some content');
        setPublishing(false);
        return;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        setMessage('You must be logged in to publish');
        setPublishing(false);
        return;
      }

      const { data, error } = await supabase
        .from('blogs')
        .insert([
          {
            title: title.trim(),
            content: content,
            category: category,
            cover_image: coverImage,
            is_published: true,
            author_id: user.id
          }
        ])
        .select();

      if (error) throw error;

      setMessage('Published successfully!');
      setTimeout(() => setMessage(''), 3000);
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
              disabled={saving}
              className="write-draft-btn"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button 
              onClick={handlePublish}
              disabled={publishing}
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
