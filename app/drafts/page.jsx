'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar/Navbar';
import { supabase } from '@/app/lib/supabase/index';
import './drafts.css';

export default function DraftsPage() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loadDrafts = async () => {
      try {
        // Check if user is authenticated
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          router.push('/login');
          return;
        }

        setUser(user);

        // Fetch drafts for the current user
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('author_id', user.id)
          .eq('is_published', false)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setDrafts(data || []);
      } catch (error) {
        console.error('Error loading drafts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDrafts();
  }, [router]);

  const handleEditDraft = (draftId) => {
    router.push(`/write?draft=${draftId}`);
  };

  const handleDeleteDraft = async (draftId) => {
    if (!confirm('Are you sure you want to delete this draft?')) return;

    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('blog_id', draftId)
        .eq('author_id', user.id);

      if (error) throw error;

      // Remove from local state
      setDrafts(drafts.filter(draft => draft.blog_id !== draftId));
    } catch (error) {
      console.error('Error deleting draft:', error);
      alert('Error deleting draft: ' + error.message);
    }
  };

  const handlePublishDraft = async (draftId) => {
    if (!confirm('Are you sure you want to publish this draft?')) return;

    try {
      const { error } = await supabase
        .from('blogs')
        .update({ is_published: true })
        .eq('blog_id', draftId)
        .eq('author_id', user.id);

      if (error) throw error;

      // Remove from drafts list
      setDrafts(drafts.filter(draft => draft.blog_id !== draftId));
      alert('Draft published successfully!');
    } catch (error) {
      console.error('Error publishing draft:', error);
      alert('Error publishing draft: ' + error.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    // Remove HTML tags for preview
    const textContent = content.replace(/<[^>]*>/g, '');
    if (textContent.length <= maxLength) return textContent;
    return textContent.substr(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="drafts-page">
        <Navbar />
        <div className="drafts-container">
          <div className="drafts-loading">Loading your drafts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="drafts-page">
      <Navbar />
      <div className="drafts-container">
        <div className="drafts-header">
          <h1>My Drafts</h1>
          <button 
            onClick={() => router.push('/write')}
            className="new-draft-btn"
          >
            + New Draft
          </button>
        </div>

        {drafts.length === 0 ? (
          <div className="no-drafts">
            <p>No drafts found.</p>
            <button 
              onClick={() => router.push('/write')}
              className="write-first-draft-btn"
            >
              Write Your First Draft
            </button>
          </div>
        ) : (
          <div className="drafts-list">
            {drafts.map((draft) => (
              <div key={draft.blog_id} className="draft-card">
                <div className="draft-content">
                  <h3 className="draft-title">
                    {draft.title || 'Untitled Draft'}
                  </h3>
                  <p className="draft-preview">
                    {truncateContent(draft.content || '')}
                  </p>
                  <div className="draft-meta">
                    <span className="draft-date">
                      Last edited: {formatDate(draft.created_at)}
                    </span>
                    <span className="draft-category">
                      {draft.category}
                    </span>
                  </div>
                </div>
                <div className="draft-actions">
                  <button
                    onClick={() => handleEditDraft(draft.blog_id)}
                    className="draft-btn draft-edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handlePublishDraft(draft.blog_id)}
                    className="draft-btn draft-publish-btn"
                  >
                    Publish
                  </button>
                  <button
                    onClick={() => handleDeleteDraft(draft.blog_id)}
                    className="draft-btn draft-delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}