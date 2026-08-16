const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** True when the route param is a blog UUID (legacy URL). */
export function isBlogUuid(value) {
  return typeof value === 'string' && UUID_RE.test(value);
}

/** Turn a title into a URL segment: flutter-state-management-with-riverpod */
export function slugifyTitle(title) {
  if (!title || typeof title !== 'string') return '';

  return title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

/** Prefer public slug; fall back to blog_id for drafts / unmigrated rows. */
export function getArticlePathSegment(blog) {
  const slug = typeof blog?.slug === 'string' ? blog.slug.trim() : '';
  if (slug) return slug;
  return blog?.blog_id ?? '';
}

/** App-router path (basePath applied by next/link): /articles/{slug} */
export function getArticlePath(blog) {
  const segment = getArticlePathSegment(blog);
  return segment ? `/articles/${segment}` : '/articles';
}

export function getArticleIdentifierColumn(identifier) {
  return isBlogUuid(identifier) ? 'blog_id' : 'slug';
}
