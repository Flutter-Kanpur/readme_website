/**
 * Upload a cover image to Supabase Storage instead of storing multi‑MB
 * base64 strings in the blogs table (which breaks Vercel static page limits).
 */

const BUCKET_MAX_BYTES = 5 * 1024 * 1024;
const UPLOAD_TARGET_BYTES = 4 * 1024 * 1024;
const MAX_DIMENSION = 1600;

function canvasToJpegBlob(canvas, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality);
  });
}

async function compressImageForUpload(blob) {
  if (typeof document === 'undefined') return blob;
  if (blob.size <= UPLOAD_TARGET_BYTES) return blob;

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

    let quality = 0.85;
    let compressed = await canvasToJpegBlob(canvas, quality);

    while (compressed && compressed.size > UPLOAD_TARGET_BYTES && quality > 0.45) {
      quality -= 0.1;
      compressed = await canvasToJpegBlob(canvas, quality);
    }

    while (compressed && compressed.size > UPLOAD_TARGET_BYTES && width > 640) {
      width = Math.round(width * 0.85);
      height = Math.round(height * 0.85);
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(bitmap, 0, 0, width, height);
      compressed = await canvasToJpegBlob(canvas, 0.8);
    }

    return compressed && compressed.size < blob.size ? compressed : blob;
  } finally {
    bitmap.close?.();
  }
}

export async function resolveCoverImageUrl(coverImage, userId, supabase) {
  if (!coverImage || typeof coverImage !== 'string') return null;

  const trimmed = coverImage.trim();
  if (!trimmed) return null;

  // Already a remote URL — keep as-is.
  if (!trimmed.startsWith('data:')) return trimmed;

  try {
    const res = await fetch(trimmed);
    const blob = await res.blob();
    const compressed = await compressImageForUpload(blob);

    if (compressed.size > BUCKET_MAX_BYTES) {
      throw new Error(
        'Cover image is too large. Please choose an image under 5 MB or use a smaller photo.',
      );
    }

    const path = `${userId}/${Date.now()}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from('blog-covers')
      .upload(path, compressed, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (uploadError) {
      const msg = uploadError.message || 'Unknown upload error';
      if (msg.includes('Bucket not found')) {
        throw new Error(
          'Cover image storage is not set up. Run migration 004_blog_covers_bucket.sql in Supabase, then reload the API schema.',
        );
      }
      if (msg.includes('maximum allowed size')) {
        throw new Error(
          'Cover image is too large. Please choose a smaller image (under 5 MB).',
        );
      }
      throw new Error(`Cover upload failed: ${msg}`);
    }

    const { data } = supabase.storage.from('blog-covers').getPublicUrl(path);
    return data.publicUrl;
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error('Cover upload failed. Please try a different image.');
  }
}
