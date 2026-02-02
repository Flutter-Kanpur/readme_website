
import { useEffect, useState } from "react";
import { getLatestArticle } from "../lib/supabase/queries";

export function useArticlesData() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const data = await getLatestArticle();
        setBlogs(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  return { blogs, loading, error };}
