'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { normalizeTags } from '@/app/lib/normalizeTags';
import './ArticleSettings.css';

export default function ArticleSettings({ onDataChange, initialData }) {
  const [category, setCategory] = useState(initialData?.category || 'Technology');
  const [tags, setTags] = useState(() =>
    initialData !== undefined
      ? normalizeTags(initialData.tags)
      : ['JavaScript', 'Web Development'],
  );
  const [tagInput, setTagInput] = useState('');
  const [featuredImage, setFeaturedImage] = useState(initialData?.coverImage || null);
  const imageInputRef = useRef(null);

  useEffect(() => {onDataChange?.({   category,   tags,  coverImage: featuredImage 
 });
  }, [category, tags, featuredImage, onDataChange]);

  const categories = [
    'Technology',
    'Design',
    'Business',
    'Lifestyle',
    'Travel',
    'Food',
    'Health',
    'Fashion'
  ];

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFeaturedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setFeaturedImage(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  return (
    <div className="settings-container">
      <h3 className="settings-title">ARTICLE SETTINGS</h3>

      <div className="settings-section">
        <label className="settings-label">Category</label>
        <select 
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="settings-select"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="settings-section">
        <label className="settings-label">Featured Image</label>
        <div 
          onClick={!featuredImage ? handleImageClick : undefined}
          className={`image-upload-container ${!featuredImage ? 'dashed' : 'solid'}`}
        >
          {!featuredImage ? (
            <div className="image-upload-placeholder">
              <Upload className="upload-icon" aria-hidden="true" />
              <p className="upload-text">Click to upload image</p>
            </div>
          ) : (
            <>
              <img 
                src={featuredImage} 
                alt="Featured" 
                className="featured-image"
              />
              <button
                onClick={handleRemoveImage}
                className="remove-image-btn"
                type="button"
                aria-label="Remove featured image"
              >
                <X className="remove-icon" aria-hidden="true" />
              </button>
            </>
          )}
        </div>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      <div className="settings-section">
        <label className="settings-label">Tags</label>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Add a tag and press Enter..."
          className="tag-input"
        />

        <div className="tags-container">
          {tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="tag-remove-btn"
                type="button"
                aria-label={`Remove tag ${tag}`}
              >
                <X className="remove-icon" aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
