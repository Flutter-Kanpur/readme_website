import { supabase } from './index';

const PREFS_PREFIX = 'blog_viewed_';
const DEDUPE_WINDOW_MS = 24 * 60 * 60 * 1000;

export function parseViewCount(blog) {
  if (!blog) return 0;
  const value = blog.view_count;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseInt(value, 10) || 0;
  return 0;
}

export function isViewsUnavailable(error) {
  if (!error) return false;
  const msg = (error.message || '').toLowerCase();
  return (
    msg.includes('view_count') ||
    msg.includes('increment_blog_view') ||
    msg.includes('does not exist') ||
    msg.includes('schema cache') ||
    msg.includes('could not find')
  );
}

export async function fetchViewCount(blogId) {
  if (!blogId) return 0;

  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('view_count')
      .eq('blog_id', blogId)
      .maybeSingle();

    if (error) {
      if (isViewsUnavailable(error)) return 0;
      throw error;
    }
    return parseViewCount(data);
  } catch (error) {
    if (isViewsUnavailable(error)) return 0;
    throw error;
  }
}

function wasViewedRecently(blogId) {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(`${PREFS_PREFIX}${blogId}`);
    if (!raw) return false;
    const when = Date.parse(raw);
    if (Number.isNaN(when)) return false;
    return Date.now() - when < DEDUPE_WINDOW_MS;
  } catch {
    return false;
  }
}

function markViewed(blogId) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      `${PREFS_PREFIX}${blogId}`,
      new Date().toISOString(),
    );
  } catch {
    // Quota / private mode — still count the view server-side once.
  }
}

/**
 * Increments the server counter once per device per blog per 24h
 * (matches Flutter BlogViewDatasource + SharedPreferences key).
 * Returns the latest count, or null if skipped/unavailable.
 * When already viewed in the last 24h, returns null without a network call
 * so the UI keeps its embedded count (egress).
 */
export async function recordView(blogId) {
  if (!blogId) return null;

  try {
    if (wasViewedRecently(blogId)) {
      return null;
    }

    const { data, error } = await supabase.rpc('increment_blog_view', {
      p_blog_id: blogId,
    });

    if (error) {
      if (isViewsUnavailable(error)) return null;
      throw error;
    }

    markViewed(blogId);
    if (typeof data === 'number') return data;
    if (typeof data === 'string') return parseInt(data, 10) || 0;
    return parseViewCount({ view_count: data });
  } catch (error) {
    console.warn('[views] recordView failed:', error?.message ?? error);
    return null;
  }
}
