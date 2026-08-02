/**
 * Shared taxonomy for home/explore filter chips and the write-page category dropdown.
 * Topic filters match blogs by category OR tags (see fetchLatestArticles).
 */

import { normalizeTags } from './normalizeTags';

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

/** Lowercase alias set for a topic filter (label + value + aliases). */
export function getTopicAliasSet(filter) {
  if (!filter || filter.kind !== 'topic') return new Set();
  const aliases = filter.aliases?.length
    ? filter.aliases
    : [filter.label, filter.value];
  const set = new Set();
  for (const alias of [filter.label, filter.value, ...aliases]) {
    const trimmed = String(alias || '')
      .trim()
      .toLowerCase();
    if (trimmed) set.add(trimmed);
  }
  return set;
}

/**
 * True if blog category or any tag matches the topic filter (case-insensitive).
 * Works for text[], jsonb arrays, or JSON-string tags after normalizeTags.
 */
export function blogMatchesTopic(blog, filter) {
  if (!blog || !filter || filter.kind !== 'topic') return false;
  const aliases = getTopicAliasSet(filter);
  if (!aliases.size) return false;

  const category = String(blog.category || '')
    .trim()
    .toLowerCase();
  if (category && aliases.has(category)) return true;

  const tags = normalizeTags(blog.tags).map((t) => t.toLowerCase());
  for (const tag of tags) {
    if (aliases.has(tag)) return true;
    // Allow light partials: alias "ui" in "ui/ux", or tag "flutter apps" containing "flutter"
    for (const alias of aliases) {
      if (alias.length >= 3 && (tag.includes(alias) || alias.includes(tag))) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Casings to try for PostgREST contains filters.
 */
export function tagMatchVariants(alias) {
  const raw = String(alias || '').trim();
  if (!raw) return [];
  const lower = raw.toLowerCase();
  const title = lower.replace(/\b\w/g, (c) => c.toUpperCase());
  const upper = raw.toUpperCase();
  return [...new Set([raw, lower, title, upper])];
}
