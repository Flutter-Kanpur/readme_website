/**
 * Upload community logo to Supabase Storage.
 * Paths: {community_id}/logo.jpg
 */

const BUCKET = 'community-logos';
const BUCKET_MAX_BYTES = 2 * 1024 * 1024;
const TARGET_BYTES = 512 * 1024;
const MAX_DIMENSION = 512;

function canvasToJpegBlob(canvas, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality);
  });
}

async function compressLogoBlob(blob) {
  if (typeof document === 'undefined') return blob;
  if (blob.size <= TARGET_BYTES) return blob;

  let bitmap;
  try {
    bitmap = await createImageBitmap(blob);
  } catch {
    return blob;
  }

  try {
    let width = bitmap.width;
    let height = bitmap.height;
    const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
    width = Math.max(1, Math.round(width * scale));
    height = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return blob;

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(bitmap, 0, 0, width, height);

    let quality = 0.88;
    let compressed = await canvasToJpegBlob(canvas, quality);

    while (compressed && compressed.size > TARGET_BYTES && quality > 0.5) {
      quality -= 0.08;
      compressed = await canvasToJpegBlob(canvas, quality);
    }

    return compressed && compressed.size < blob.size ? compressed : blob;
  } finally {
    bitmap.close?.();
  }
}

export async function uploadCommunityLogo(imageSource, communityId, supabase) {
  if (!imageSource || typeof imageSource !== 'string' || !communityId) return null;

  const trimmed = imageSource.trim();
  if (!trimmed) return null;
  if (!trimmed.startsWith('data:')) return trimmed;

  const res = await fetch(trimmed);
  const blob = await res.blob();
  const compressed = await compressLogoBlob(blob);

  if (compressed.size > BUCKET_MAX_BYTES) {
    throw new Error('Logo is too large. Please use an image under 2 MB.');
  }

  const path = `${communityId}/logo.jpg`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, compressed, {
    contentType: 'image/jpeg',
    upsert: true,
  });

  if (uploadError) {
    const msg = uploadError.message || 'Unknown upload error';
    if (msg.includes('Bucket not found')) {
      throw new Error(
        'Community logo storage is not set up. Run migration 007_community_logos_bucket.sql in Supabase.',
      );
    }
    throw new Error(`Logo upload failed: ${msg}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const cacheBust = `${data.publicUrl}?v=${Date.now()}`;
  return cacheBust;
}
