const OG_PROXY_PATH = '/api/og-image';
const DEFAULT_OG_PATH = '/assets/og-default.jpg';

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

export function isAllowedOgSource(urlString) {
  try {
    const url = new URL(urlString);
    return url.protocol === 'https:' && ALLOWED_IMAGE_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

/**
 * Same-domain share preview (1200×630 JPEG via /api/og-image).
 * WhatsApp/Facebook prefer og:image on the page's domain, not Supabase URLs.
 */
export function buildOgImageUrl(coverUrl) {
  const origin = getSiteOrigin();
  return `${origin}/blogs${OG_PROXY_PATH}?src=${encodeURIComponent(coverUrl)}`;
}

/** Site default OG JPEG — always same-domain, always present. */
export function getDefaultShareImageUrl() {
  return `${getSiteOrigin()}/blogs${DEFAULT_OG_PATH}`;
}

/**
 * Always return a crawler-safe same-domain image URL.
 * Allowlisted Supabase covers go through the proxy; everything else uses default.
 */
export function resolveShareImageUrl(coverUrl) {
  if (coverUrl && isAllowedOgSource(coverUrl)) {
    return buildOgImageUrl(coverUrl);
  }
  return getDefaultShareImageUrl();
}

/** Alias used by article metadata + JSON-LD. */
export function resolveArticleShareImage(coverUrl) {
  return resolveShareImageUrl(coverUrl);
}

export { ALLOWED_IMAGE_HOSTS, DEFAULT_OG_PATH };
