/** WhatsApp / LinkedIn struggle with multi‑MB covers — compress above this. */
export const OG_SHARE_SIZE_LIMIT_BYTES = 2 * 1024 * 1024;

const ALLOWED_IMAGE_HOSTS = new Set([
  'uktnmjykbyuvfsbtawwg.supabase.co',
]);

/** Public site origin — must match metadataBase in app/layout.jsx. */
const DEFAULT_SITE_ORIGIN = 'https://readme.flutterkanpur.in';

export function getSiteOrigin() {
  // Never use VERCEL_URL here: deployment URLs can be SSO-protected, so
  // WhatsApp/Facebook cannot fetch og:image from them.
  return process.env.NEXT_PUBLIC_SITE_ORIGIN || DEFAULT_SITE_ORIGIN;
}

/**
 * Build a crawler-friendly preview URL via Next.js image optimizer.
 * Returns a resized image on the public domain (valid binary, no SSO).
 */
export function buildOgImageUrl(coverUrl) {
  const origin = getSiteOrigin();
  const params = new URLSearchParams({
    url: coverUrl,
    w: '1200',
    q: '75',
  });
  return `${origin}/blogs/_next/image?${params.toString()}`;
}

export function isAllowedOgSource(urlString) {
  try {
    const url = new URL(urlString);
    return url.protocol === 'https:' && ALLOWED_IMAGE_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

/**
 * Use the raw cover for og:image when it is already small enough; otherwise
 * serve a resized copy through Next.js image optimizer (~400 KB JPEG/PNG).
 */
export async function resolveShareImageUrl(coverUrl) {
  if (!coverUrl) return null;
  if (!isAllowedOgSource(coverUrl)) return coverUrl;

  try {
    const res = await fetch(coverUrl, {
      method: 'HEAD',
      next: { revalidate: 3600 },
    });

    if (!res.ok) return buildOgImageUrl(coverUrl);

    const lengthHeader = res.headers.get('content-length');
    const bytes = lengthHeader ? Number.parseInt(lengthHeader, 10) : NaN;

    if (!Number.isFinite(bytes) || bytes > OG_SHARE_SIZE_LIMIT_BYTES) {
      return buildOgImageUrl(coverUrl);
    }

    return coverUrl;
  } catch {
    return buildOgImageUrl(coverUrl);
  }
}
