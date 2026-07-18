import { useEffect, useState } from "react";
import { getLatestArticle } from "../lib/supabase/queries";
import { preloadLikedBlogIds } from "../lib/supabase/likeCache";

export function useArticlesData(activeFilter, initialData = []) {
  const [blogs, setBlogs] = useState(initialData);
  const [loading, setLoading] = useState(initialData.length === 0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData.length > 0) {
      preloadLikedBlogIds(initialData.map((b) => b.blog_id)).catch(() => {});
    }
    // Prefetch liked state for SSR initial blogs once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Skip initial fetch if we already have data for the default filter
    if (
      activeFilter === "for_you" &&
      initialData.length > 0 &&
      blogs === initialData
    ) {
      setLoading(false);
      return;
    }

    async function fetchArticles() {
      setLoading(true);
      try {
        const data = await getLatestArticle(activeFilter);
        const list = data || [];
        await preloadLikedBlogIds(list.map((b) => b.blog_id)).catch(() => {});
        setBlogs(list);
      } catch (err) {
        console.error("fetchArticles:", err);
        setError(err?.message ?? "Failed to load articles");
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, [activeFilter]);

  return { blogs, loading, error };
}
