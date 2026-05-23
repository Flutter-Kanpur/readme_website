'use client';

import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { supabase } from '@/app/lib/supabase';
import { uploadCommunityLogo } from '@/app/lib/uploadCommunityLogo';
import { updateCommunityLogo } from '@/app/lib/supabase/communities';

export default function CommunityLogoSettings({
  communityId,
  communityName,
  initialLogoUrl,
  onUpdated,
}) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(initialLogoUrl || null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const hasNewImage = typeof preview === 'string' && preview.startsWith('data:');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result ?? null);
      setMessage('');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!hasNewImage || !communityId) return;

    setUploading(true);
    setMessage('');
    try {
      const logoUrl = await uploadCommunityLogo(preview, communityId, supabase);
      const savedUrl = await updateCommunityLogo(communityId, logoUrl);
      setPreview(savedUrl);
      onUpdated?.(savedUrl);
      setMessage('Community icon updated.');
    } catch (err) {
      setMessage(err.message || 'Could not upload icon.');
    } finally {
      setUploading(false);
    }
  };

  const initial = communityName?.charAt(0)?.toUpperCase() ?? 'C';

  return (
    <div className="community-logo-settings">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="community-logo-settings__preview-btn"
        aria-label="Choose community icon"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="community-logo-settings__preview" />
        ) : (
          <span className="community-logo-settings__placeholder">{initial}</span>
        )}
        <span className="community-logo-settings__overlay">
          <Upload className="w-5 h-5" aria-hidden="true" />
        </span>
      </button>

      <div className="community-logo-settings__copy">
        <h3 className="font-semibold text-sm mb-1">Community icon</h3>
        <p className="text-sm text-gray-500 mb-3">
          Shown on your community profile, article cards, and listings. Square images work best.
        </p>
        <div className="community-logo-settings__actions">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="community-profile__btn community-profile__btn--secondary"
          >
            Choose image
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={uploading || !hasNewImage}
            className="community-profile__btn community-profile__btn--primary"
          >
            {uploading ? 'Saving…' : 'Save icon'}
          </button>
        </div>
        {message && <p className="text-sm text-gray-600 mt-2">{message}</p>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
