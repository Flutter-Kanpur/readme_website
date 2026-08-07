/** WhatsApp / LinkedIn struggle with multi‑MB covers — compress above this. */
export const OG_SHARE_SIZE_LIMIT_BYTES = 2 * 1024 * 1024;

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

/** App is served under /blogs — API URLs must include basePath for crawlers. */
export function buildOgProxyUrl(coverUrl) {
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

/**
 * Use the raw cover for og:image when it is already small enough; otherwise
 * route through the compression API (1200×630 JPEG, ≤ ~500 KB).
 */
export async function resolveShareImageUrl(coverUrl) {
  if (!coverUrl || !isAllowedOgSource(coverUrl)) return coverUrl || null;

  try {
    const res = await fetch(coverUrl, {
      method: 'HEAD',
      next: { revalidate: 3600 },
    });

    if (!res.ok) return buildOgProxyUrl(coverUrl);

    const lengthHeader = res.headers.get('content-length');
    const bytes = lengthHeader ? Number.parseInt(lengthHeader, 10) : NaN;

    if (!Number.isFinite(bytes) || bytes > OG_SHARE_SIZE_LIMIT_BYTES) {
      return buildOgProxyUrl(coverUrl);
    }

    return coverUrl;
  } catch {
    return buildOgProxyUrl(coverUrl);
  }
}
