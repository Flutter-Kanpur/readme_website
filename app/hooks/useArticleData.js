import { useEffect, useRef, useState } from "react";
import { getFeed } from "@/app/lib/data/feed";
import { preloadLikedBlogIds } from "../lib/supabase/likeCache";
import { seedEngagementFromBlog } from "@/app/lib/engagementStore";

export function useArticlesData(activeFilter, initialData = []) {
  const [fetched, setFetched] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const preloadedRef = useRef(false);
  const skippedDefaultRef = useRef(false);

  const blogs =
    fetched && fetched.filter === activeFilter
      ? fetched.blogs
      : activeFilter === "for_you"
        ? initialData
        : [];

  useEffect(() => {
    if (!initialData.length || preloadedRef.current) return;
    preloadedRef.current = true;
    initialData.forEach(seedEngagementFromBlog);
    preloadLikedBlogIds(initialData.map((b) => b.blog_id)).catch(() => {});
  }, [initialData]);

  useEffect(() => {
    // First For You paint: trust SSR (no duplicate feed egress).
    if (
      activeFilter === "for_you" &&
      initialData.length > 0 &&
      !skippedDefaultRef.current
    ) {
      skippedDefaultRef.current = true;
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const data = await getFeed(activeFilter);
        const list = data || [];
        list.forEach(seedEngagementFromBlog);
        await preloadLikedBlogIds(list.map((b) => b.blog_id)).catch(() => {});
        if (!cancelled) {
          setFetched({ filter: activeFilter, blogs: list });
        }
      } catch (err) {
        console.error("fetchArticles:", err);
        if (!cancelled) setError(err?.message ?? "Failed to load articles");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // initialData.length only gates the first skip; filter drives refetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  return {
    blogs,
    loading: loading && blogs.length === 0,
    error,
  };
}
