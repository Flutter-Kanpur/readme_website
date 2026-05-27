'use client';

import { useState, useRef, useEffect, use, useCallback } from 'react';
import Editor from "../../components/Editor";
import ArticleSettings from "../../components/ArticleSettings";
import CommunityPublishSettings from "../../components/CommunityPublishSettings";
import Navbar from '../../components/Navbar/Navbar';
import { supabase } from "@/app/lib/supabase";
import { getSafeUser } from "@/app/lib/supabase/auth";
import {
  getUserCommunities,
  syncBlogCoauthors,
  getBlogCoauthorIds,
  canPublishInCommunity,
} from "@/app/lib/supabase/communities";
import { resolveCoverImageUrl } from "@/app/lib/uploadCoverImage";
import { normalizeTags } from "@/app/lib/normalizeTags";
import '@/app/write/write.css';
import { useRouter } from 'next/navigation';

export default function EditPage({ params }) {
  const { blogId } = use(params);
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [message, setMessage] = useState('');
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [communities, setCommunities] = useState([]);
  const [communityId, setCommunityId] = useState(null);
  const [coAuthorIds, setCoAuthorIds] = useState([]);

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
      setIsAuthenticated(!!user);
      if (user) {
        getUserCommunities(user.id)
          .then(setCommunities)
          .catch((err) => console.error('Load communities error:', err));
      }
    });

    const fetchBlog = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('blog_id', blogId)
          .single();

        if (error) throw error;

        const coauthors = await getBlogCoauthorIds(blogId);

        const fetchedData = {
          title: data.title || '',
          content: data.content || '',
          category: data.category || 'Technology',
          tags: normalizeTags(data.tags),
          coverImage: data.cover_image || null,
        };

        setCommunityId(data.community_id || null);
        setCoAuthorIds(coauthors);
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
    if (published) setPublished(false);
  };

  const handleCommunityChange = useCallback(({ communityId: nextId, coAuthorIds: nextCoAuthors }) => {
    setCommunityId(nextId);
    setCoAuthorIds(nextCoAuthors ?? []);
  }, []);

  const handleUpdate = async (isPublished) => {
    if (!isAuthenticated) {
      setMessage('You must be authenticated to update');
      return;
    }

    if (isPublished && communityId && !canPublishCommunity) {
      setMessage('Only editors and admins can publish for this community.');
      return;
    }

    if (isPublished) {
      setPublishing(true);
      setPublished(false);
    } else {
      setSaving(true);
    }

    setMessage('');

    try {
      const { title, content, category, coverImage, tags } = editorDataRef.current;

      if (!title.trim()) {
        setMessage('Please add a title');
        setSaving(false);
        setPublishing(false);
        return;
      }

      const user = await getSafeUser();
      if (!user) {
        setMessage('You must be logged in to update blogs');
        setSaving(false);
        setPublishing(false);
        return;
      }

      const cover_image = await resolveCoverImageUrl(
        coverImage,
        user.id,
        supabase,
      );

      const { error } = await supabase
        .from('blogs')
        .update({
          title: title.trim(),
          content,
          category,
          tags,
          cover_image,
          is_published: isPublished,
          community_id: communityId || null,
        })
        .eq('blog_id', blogId)
        .eq('author_id', user.id);

      if (error) throw error;

      await syncBlogCoauthors(blogId, coAuthorIds, user.id);

      if (isPublished) setPublished(true);
      setMessage(isPublished ? 'Updated & Published successfully!' : 'Draft updated successfully!');
      setTimeout(() => setMessage(''), 3000);
      if (isPublished) {
        router.push('/');
      } else {
        setTimeout(() => router.push('/drafts'), 600);
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
              <CommunityPublishSettings
                communities={communities}
                communityId={communityId}
                coAuthorIds={coAuthorIds}
                onChange={handleCommunityChange}
              />
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
              disabled={publishing || published || loading || !initialData || (communityId && !canPublishCommunity)}
              aria-busy={publishing}
              className={`write-publish-btn${published ? ' write-publish-btn--published' : ''}`}
            >
              {publishing ? 'Publishing...' : published ? 'Published ✓' : 'Update & Publish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
