import { useEffect, useState } from "react";
import { getLatestArticle } from "../lib/supabase/queries";

export function useArticlesData(activeFilter) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      try {
        const data = await getLatestArticle(activeFilter);
        setBlogs(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, [activeFilter]); 

  return { blogs, loading, error };
}
