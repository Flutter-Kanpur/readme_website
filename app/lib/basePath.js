/**
 * App is served under /blogs (Flutter Kanpur site reverse-proxy + mobile app).
 * Bare domain readme.flutterkanpur.in/ redirects to /blogs (see next.config.ts).
 * Keep in sync with next.config.ts `basePath`.
 *
 * next/link and next/navigation router already apply basePath — use this for
 * raw <img>/<a>, window.location, and absolute OAuth callback URLs.
 */
export const BASE_PATH = "/blogs";

export function withBasePath(path = "/") {
  if (!path) return BASE_PATH || "/";
  if (
    /^https?:\/\//i.test(path) ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (
    normalized === BASE_PATH ||
    normalized.startsWith(`${BASE_PATH}/`)
  ) {
    return normalized;
  }
  return `${BASE_PATH}${normalized}`;
}

/** Full URL for auth redirects (origin + basePath + path). */
export function absoluteAppUrl(path = "/") {
  const prefixed = withBasePath(path);
  if (typeof window === "undefined") return prefixed;
  return `${window.location.origin}${prefixed}`;
}
