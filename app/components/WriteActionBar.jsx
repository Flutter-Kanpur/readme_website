'use client';

export default function WriteActionBar({
  message,
  saving,
  publishing,
  published,
  busy,
  draftLabel = 'Save Draft',
  publishLabel = 'Publish',
  onSaveDraft,
  onPublish,
  publishDisabled = false,
  saveDisabled = false,
  className = '',
}) {
  return (
    <div className={`write-actions ${className}`.trim()}>
      {message && (
        <span
          className={`write-message ${
            message.includes('Error') ? 'write-message-error' : 'write-message-success'
          }`}
        >
          {message}
        </span>
      )}
      <div className="write-buttons">
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={busy || saveDisabled}
          aria-busy={saving}
          className="write-draft-btn"
        >
          {saving ? 'Saving...' : draftLabel}
        </button>
        <button
          type="button"
          onClick={onPublish}
          disabled={busy || published || publishDisabled}
          aria-busy={publishing}
          className={`write-publish-btn${published ? ' write-publish-btn--published' : ''}`}
        >
          {publishing ? 'Publishing...' : published ? 'Published ✓' : publishLabel}
        </button>
      </div>
    </div>
  );
}
