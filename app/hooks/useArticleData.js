import { useEffect, useState } from "react";
import { getLatestArticle } from "../lib/supabase/queries";

export function useArticlesData(activeFilter, initialData = []) {
  const [blogs, setBlogs] = useState(initialData);
  const [loading, setLoading] = useState(initialData.length === 0);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Skip initial fetch if we already have data for the default filter
    if (activeFilter === "for_you" && initialData.length > 0 && blogs === initialData) {
        setLoading(false);
        return;
    }

    async function fetchArticles() {
      setLoading(true);
      try {
        const data = await getLatestArticle(activeFilter);
        setBlogs(data || []);
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
