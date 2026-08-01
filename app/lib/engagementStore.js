/**
 * In-session engagement counts shared between list cards and article detail.
 * Survives soft navigations so home/explore match detail after like/view.
 */

const countsByBlogId = new Map();
const listeners = new Set();
let version = 0;

export function getEngagementVersion() {
  return version;
}

export function getEngagementCounts(blogId) {
  if (!blogId) return null;
  return countsByBlogId.get(blogId) ?? null;
}

export function setEngagementCounts(blogId, patch) {
  if (!blogId || !patch) return;
  const prev = countsByBlogId.get(blogId) ?? {};
  const next = {
    likeCount:
      typeof patch.likeCount === 'number' ? patch.likeCount : prev.likeCount,
    viewCount:
      typeof patch.viewCount === 'number' ? patch.viewCount : prev.viewCount,
  };
  countsByBlogId.set(blogId, next);
  version += 1;
  listeners.forEach((fn) => {
    try {
      fn(blogId, next);
    } catch {
      // ignore subscriber errors
    }
  });
}

export function subscribeEngagement(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Seed from a blog row without wiping fresher in-session values. */
export function seedEngagementFromBlog(blog) {
  if (!blog?.blog_id) return;
  const existing = countsByBlogId.get(blog.blog_id);
  const likeCount =
    typeof blog.like_count === 'number' ? blog.like_count : undefined;
  const viewCount =
    typeof blog.view_count === 'number' ? blog.view_count : undefined;

  if (likeCount == null && viewCount == null) return;

  const next = {
    likeCount: existing?.likeCount ?? likeCount ?? 0,
    viewCount: existing?.viewCount ?? viewCount ?? 0,
  };

  if (existing) {
    if (typeof likeCount === 'number') {
      next.likeCount = Math.max(existing.likeCount ?? 0, likeCount);
    }
    if (typeof viewCount === 'number') {
      next.viewCount = Math.max(existing.viewCount ?? 0, viewCount);
    }
  }

  const same =
    existing &&
    existing.likeCount === next.likeCount &&
    existing.viewCount === next.viewCount;
  if (same) return;

  countsByBlogId.set(blog.blog_id, next);
  version += 1;
  listeners.forEach((fn) => {
    try {
      fn(blog.blog_id, next);
    } catch {
      // ignore
    }
  });
}
