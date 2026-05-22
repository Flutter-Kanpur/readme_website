/**
 * Upload a cover image to Supabase Storage instead of storing multi‑MB
 * base64 strings in the blogs table (which breaks Vercel static page limits).
 */
export async function resolveCoverImageUrl(coverImage, userId, supabase) {
  if (!coverImage || typeof coverImage !== 'string') return null

  const trimmed = coverImage.trim()
  if (!trimmed) return null

  // Already a remote URL — keep as-is.
  if (!trimmed.startsWith('data:')) return trimmed

  try {
    const res = await fetch(trimmed)
    const blob = await res.blob()
    const ext =
      blob.type?.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg'
    const path = `${userId}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('blog-covers')
      .upload(path, blob, {
        contentType: blob.type || 'image/jpeg',
        upsert: false,
      })

    if (uploadError) {
      console.error('Cover upload failed:', uploadError.message)
      // Do not fall back to saving the data URL in the DB.
      return null
    }

    const { data } = supabase.storage.from('blog-covers').getPublicUrl(path)
    return data.publicUrl
  } catch (err) {
    console.error('Cover upload error:', err)
    return null
  }
}
