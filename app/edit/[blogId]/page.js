'use client';

import { useState, useRef, useEffect, use } from 'react';
import Editor from "../../components/Editor";
import ArticleSettings from "../../components/ArticleSettings";
import Navbar from '../../components/Navbar/Navbar';
import { supabase } from "@/app/lib/supabase";
import '@/app/write/write.css';
import { useRouter } from 'next/navigation';

export default function EditPage({ params }) {
  const { blogId } = use(params);
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState('');
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  const editorDataRef = useRef({
    title: '',
    content: '',
    category: 'Technology',
    tags: [],
    coverImage: null
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setIsAuthenticated(!!data?.user);
    });

    const fetchBlog = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('blog_id', blogId)
          .single();

        if (error) throw error;

        const fetchedData = {
          title: data.title || '',
          content: data.content || '',
          category: data.category || 'Technology',
          tags: data.tags || [],
          coverImage: data.cover_image || null
        };

        setInitialData(fetchedData);
        editorDataRef.current = fetchedData;
      } catch (err) {
        console.error('Error fetching blog:', err);
        setMessage('Error loading blog: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [blogId]);

  const updateEditorData = (data) => {
    editorDataRef.current = { ...editorDataRef.current, ...data };
  };

  const handleUpdate = async (isPublished) => {
    if (!isAuthenticated) {
      setMessage('You must be authenticated to update');
      return;
    }

    if (isPublished) setPublishing(true);
    else setSaving(true);
    
    setMessage('');

    try {
      const { title, content, category, coverImage, tags } = editorDataRef.current;

      if (!title.trim()) {
        setMessage('Please add a title');
        setSaving(false); setPublishing(false);
        return;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setMessage('You must be logged in to update blogs');
        setSaving(false); setPublishing(false);
        return;
      }

      const { error } = await supabase
        .from('blogs')
        .update({
          title: title.trim(),
          content: content,
          category: category,
          tags: tags,
          cover_image: coverImage,
          is_published: isPublished
        })
        .eq('blog_id', blogId)
        .eq('author_id', user.id); 

      if (error) throw error;

      setMessage(isPublished ? 'Updated & Published successfully!' : 'Draft updated successfully!');
      setTimeout(() => setMessage(''), 3000);
      if (isPublished) {
        router.push('/');
      }
    } catch (error) {
      console.error('Error updating:', error);
      setMessage('Error updating: ' + error.message);
    } finally {
      if (isPublished) setPublishing(false);
      else setSaving(false);
    }
  };

  return (
    <div className="write-page">
      <Navbar />

      <div className="write-content">
        {loading ? (
          <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', width: '100%', height: '50vh', alignItems: 'center' }}>
            <h2>Loading blog data...</h2>
          </div>
        ) : initialData ? (
          <>
            <div className="write-editor-section">
              <div className="write-editor-wrapper">
                <Editor onDataChange={updateEditorData} initialData={initialData} />
              </div>
            </div>

            <div className="write-sidebar">
              <ArticleSettings onDataChange={updateEditorData} initialData={initialData} />
            </div>
          </>
        ) : (
          <div style={{ padding: '2rem', color: 'red' }}>Failed to load blog data.</div>
        )}
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
              onClick={() => handleUpdate(false)}
              disabled={saving || loading || !initialData}
              className="write-draft-btn"
            >
              {saving ? 'Saving...' : 'Update Draft'}
            </button>
            <button 
              onClick={() => handleUpdate(true)}
              disabled={publishing || loading || !initialData}
              className="write-publish-btn"
            >
              {publishing ? 'Publishing...' : 'Update & Publish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
