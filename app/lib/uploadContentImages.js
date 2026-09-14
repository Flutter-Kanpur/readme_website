/**
 * Rewrite base64 <img> tags inside article content HTML into uploaded
 * Storage URLs before the content is saved — same problem resolveCoverImageUrl
 * solves for the cover, applied to every image the editor's image tool
 * inserts into the body (Editor.js reads files via FileReader.readAsDataURL,
 * so without this every inline image stays a multi-MB base64 blob baked
 * into blogs.content).
 */

import { compressImageForUpload } from './uploadCoverImage';

const BUCKET_MAX_BYTES = 5 * 1024 * 1024;

export async function resolveContentImageUrls(html, userId, supabase) {
  if (!html || typeof html !== 'string' || typeof document === 'undefined') {
    return html;
  }
  if (!html.includes('data:')) return html;

  const doc = new DOMParser().parseFromString(html, 'text/html');
  const dataImages = Array.from(doc.querySelectorAll('img[src^="data:"]'));
  if (!dataImages.length) return html;

  let index = 0;
  for (const img of dataImages) {
    index += 1;
    const res = await fetch(img.getAttribute('src'));
    const blob = await res.blob();
    const compressed = await compressImageForUpload(blob);

    if (compressed.size > BUCKET_MAX_BYTES) {
      throw new Error(
        'One of the images in your article is too large. Please use images under 5 MB.',
      );
    }

    const path = `${userId}/content-${Date.now()}-${index}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from('blog-covers')
      .upload(path, compressed, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (uploadError) {
      const msg = uploadError.message || 'Unknown upload error';
      if (msg.includes('maximum allowed size')) {
        throw new Error(
          'One of the images in your article is too large. Please use images under 5 MB.',
        );
      }
      throw new Error(`Image upload failed: ${msg}`);
    }

    const { data } = supabase.storage.from('blog-covers').getPublicUrl(path);
    img.setAttribute('src', data.publicUrl);
  }

  return doc.body.innerHTML;
}
