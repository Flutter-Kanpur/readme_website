import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase/index";

export function useArticlesData() {
  const [blogs, setblogs] = useState([]);
  const [filters, setFilters] = useState([]);
  const [trends, setTrends] = useState([]);
  const [writers, setWriters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  async function fetchAllData() {
    setLoading(true);

    const [
      { data: blogsData },
      { data: filtersData },
      { data: trendingData },       
      { data: writersData },
    ] = await await Promise.all([
  supabase.from("blogs").select("*"),
  supabase.from("categories").select("*"),
  supabase.from("popular_posts").select("*").order("rank"),
  supabase.from("authors").select("*"),
]);


    
    setblogs(blogsData || []);
    setFilters(filtersData || []);
    setTrends(trendingData || []);
    setWriters(writersData || []);
    setLoading(true);
  }

  return {
    blogs,
    filters,
    trends,
    writers,
    loading,
  };
}
