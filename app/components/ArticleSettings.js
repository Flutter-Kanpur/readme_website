'use client';

import { useState, useRef, useEffect } from 'react';
import Icon from './Icon';
import './ArticleSettings.css';

export default function ArticleSettings({ onDataChange }) {
  const [category, setCategory] = useState('Technology');
  const [tags, setTags] = useState(['JavaScript', 'Web Development']);
  const [tagInput, setTagInput] = useState('');
  const [featuredImage, setFeaturedImage] = useState(null);
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
              <Icon src="/assets/icons/upload.png" alt="Upload" className="upload-icon" />
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
              >
                <Icon src="/assets/icons/close.png" alt="Remove" className="remove-icon" />
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
              >
                <Icon src="/assets/icons/close.png" alt="Remove" className="remove-icon" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
