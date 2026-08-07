const OG_PROXY_PATH = '/api/og-image';

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
 * Same-domain share preview (1200×630 JPEG via /api/og-image).
 * WhatsApp/Facebook prefer og:image on the page's domain, not Supabase URLs.
 */
export function buildOgImageUrl(coverUrl) {
  const origin = getSiteOrigin();
  return `${origin}/blogs${OG_PROXY_PATH}?src=${encodeURIComponent(coverUrl)}`;
}

export function isAllowedOgSource(urlString) {
  try {
    const url = new URL(urlString);
    return url.protocol === 'https:' && ALLOWED_IMAGE_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

/** Always serve share previews from our domain so WhatsApp can fetch them. */
export function resolveShareImageUrl(coverUrl) {
  if (!coverUrl) return null;
  if (!isAllowedOgSource(coverUrl)) return coverUrl;
  return buildOgImageUrl(coverUrl);
}
