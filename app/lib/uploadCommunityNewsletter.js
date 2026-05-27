/**
 * Upload a newsletter attachment (PDF / image) to Supabase Storage.
 * Path convention: {community_id}/{timestamp}-{slug}.{ext}
 *
 * Returns { url, name, size } on success.
 */

const BUCKET = 'community-newsletters';
const BUCKET_MAX_BYTES = 20 * 1024 * 1024; // matches migration 009
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
]);

function slugifyFileName(name) {
  const lastDot = name.lastIndexOf('.');
  const stem = lastDot > 0 ? name.slice(0, lastDot) : name;
  return stem
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'newsletter';
}

function inferExtension(file) {
  if (file.type === 'application/pdf') return 'pdf';
  if (file.type === 'image/png') return 'png';
  if (file.type === 'image/jpeg') return 'jpg';
  const dot = file.name.lastIndexOf('.');
  return dot > 0 ? file.name.slice(dot + 1).toLowerCase() : 'bin';
}

export async function uploadCommunityNewsletterFile(file, communityId, supabase) {
  if (!file || !communityId) return null;

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error('Unsupported file type. Upload a PDF, PNG or JPEG.');
  }

  if (file.size > BUCKET_MAX_BYTES) {
    throw new Error('File is too large. Maximum size is 20 MB.');
  }

  const slug = slugifyFileName(file.name || 'newsletter');
  const ext = inferExtension(file);
  const path = `${communityId}/${Date.now()}-${slug}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
      cacheControl: '3600',
    });

  if (uploadError) {
    const msg = uploadError.message || 'Unknown upload error';
    if (msg.includes('Bucket not found')) {
      throw new Error(
        'Newsletter storage is not set up. Run migration 009_community_newsletter_uploads.sql in Supabase.',
      );
    }
    throw new Error(`Newsletter upload failed: ${msg}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return {
    url: data.publicUrl,
    name: file.name,
    size: file.size,
  };
}

export function isPdfUrl(url) {
  if (!url) return false;
  const cleaned = url.split('?')[0].toLowerCase();
  return cleaned.endsWith('.pdf');
}

export function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
