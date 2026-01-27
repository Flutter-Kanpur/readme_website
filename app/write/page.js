'use client';

import { useState, useRef } from 'react';
import Editor from "../components/Editor";
import ArticleSettings from "../components/ArticleSettings";
import { supabase } from "@/lib/supabase";

export default function WritePage() {
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
    setSaving(true);
    setMessage('');

    try {
      const { title, content, category, coverImage } = editorDataRef.current;

      if (!title.trim()) {
        setMessage('Please add a title');
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
            author_id: null,
            image_paths: []
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

      const { data, error } = await supabase
        .from('blogs')
        .insert([
          {
            title: title.trim(),
            content: content,
            category: category,
            cover_image: coverImage,
            is_published: true,
            author_id: null,
            image_paths: []
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
    <div className="h-screen flex flex-col bg-white">

      <div className="flex justify-between items-center border-b px-8 py-4">
        <span className="font-semibold text-lg">Readme</span>

        <div className="flex items-center gap-4">
          {message && (
            <span className={`text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </span>
          )}
          <button 
            onClick={handleSaveDraft}
            disabled={saving}
            className="text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button 
            onClick={handlePublish}
            disabled={publishing}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {publishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="flex flex-1">
        <div className="flex-1 py-8 flex justify-center overflow-y-auto">
          <div className="w-full max-w-[720px] px-4">
            <Editor onDataChange={updateEditorData} />
          </div>
        </div>

        <div className="w-[320px] border-l border-gray-200 px-6 py-8">
          <ArticleSettings onDataChange={updateEditorData} />
        </div>

      </div>
    </div>
  );
}
