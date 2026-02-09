"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import ArticleCard from "../components/HomepageComponents/ArticleCard";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    async function fetchSearchResults() {
      setLoading(true);

      const { data, error } = await supabase
        .from("blogs")
        .select(
          `
          blog_id,
          title,
          content,
          category,
          cover_image,
          profiles (
            name,
            avatar_url
          )
        `
        )
        .eq("is_published", true)
        .or(
          `title.ilike.%${query}%,content.ilike.%${query}%,category.ilike.%${query}%`
        );

      if (error) {
        console.error("Search error:", error);
      } else {
        setArticles(data || []);
      }

      setLoading(false);
    }

    fetchSearchResults();
  }, [query]);

  return (
    <main className="grid-background min-h-screen">
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-xl font-semibold mb-6">
          Search results for: <span className="text-blue-500">{query}</span>
        </h1>

        {loading ? (
          <p className="text-gray-400">Searching...</p>
        ) : articles.length === 0 ? (
          <p className="text-gray-400">No articles found.</p>
        ) : (
          <div className="space-y-6">
            {articles.map((article) => (
              <ArticleCard key={article.blog_id} article={article} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <main className="grid-background min-h-screen">
        <section className="max-w-6xl mx-auto px-4 py-12">
          <p className="text-gray-400">Loading search...</p>
        </section>
      </main>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
