/**
 * Shared taxonomy for home/explore filter chips and the write-page category dropdown.
 * Topic filters match blogs by category OR tags (see fetchLatestArticles).
 */

/** Primary categories shown in Article Settings. */
export const EDITOR_CATEGORIES = [
  'Technology',
  'Design',
  'Business',
  'Lifestyle',
  'Travel',
  'Food',
  'Health',
  'Fashion',
];

/**
 * @typedef {{ label: string, value: string, kind: 'special' | 'topic', aliases?: string[] }} FeedFilter
 */

/** @type {FeedFilter[]} */
export const FEED_FILTERS = [
  { label: 'For You', value: 'for_you', kind: 'special' },
  { label: 'Communities', value: 'communities', kind: 'special' },
  { label: 'Technology', value: 'technology', kind: 'topic', aliases: ['technology'] },
  { label: 'Design', value: 'design', kind: 'topic', aliases: ['design'] },
  { label: 'Business', value: 'business', kind: 'topic', aliases: ['business'] },
  { label: 'Lifestyle', value: 'lifestyle', kind: 'topic', aliases: ['lifestyle'] },
  { label: 'Flutter', value: 'flutter', kind: 'topic', aliases: ['flutter'] },
  { label: 'React', value: 'react', kind: 'topic', aliases: ['react'] },
  { label: 'Backend', value: 'backend', kind: 'topic', aliases: ['backend'] },
  { label: 'UI', value: 'ui', kind: 'topic', aliases: ['ui', 'user interface'] },
  { label: 'DSA', value: 'dsa', kind: 'topic', aliases: ['dsa', 'data structures', 'algorithms'] },
];

export function getFeedFilter(value) {
  if (!value) return null;
  const key = String(value).toLowerCase();
  return FEED_FILTERS.find((f) => f.value === key) ?? null;
}

/**
 * Casings to try for PostgREST `tags.cs.{Tag}` (array contains is case-sensitive).
 * Always includes lowercase, Title Case, and original alias text.
 */
export function tagMatchVariants(alias) {
  const raw = String(alias || '').trim();
  if (!raw) return [];
  const lower = raw.toLowerCase();
  const title = lower.replace(/\b\w/g, (c) => c.toUpperCase());
  const upper = raw.toUpperCase();
  return [...new Set([raw, lower, title, upper])];
}

function quotePostgrestValue(value) {
  // Quote when needed so spaces / special chars survive inside `.or()`.
  if (/^[a-zA-Z0-9_-]+$/.test(value)) return value;
  return `"${String(value).replace(/"/g, '')}"`;
}

/**
 * Build PostgREST `.or()` clause for a topic filter:
 * category.ilike.<alias> OR tags contains any casing variant.
 */
export function buildTopicOrFilter(filter) {
  if (!filter || filter.kind !== 'topic') return null;

  const aliases = filter.aliases?.length
    ? filter.aliases
    : [filter.label, filter.value];

  const parts = [];
  for (const alias of aliases) {
    const trimmed = String(alias).trim().replace(/[,()]/g, '');
    if (!trimmed) continue;
    parts.push(`category.ilike.${quotePostgrestValue(trimmed)}`);
    for (const variant of tagMatchVariants(trimmed)) {
      const clean = variant.replace(/"/g, '');
      // text[] contains: tags.cs.{"Exact Tag"}
      parts.push(`tags.cs.{${quotePostgrestValue(clean)}}`);
    }
  }

  return parts.length ? parts.join(',') : null;
}
