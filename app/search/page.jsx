"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import ArticleCard from "../components/HomepageComponents/ArticleCard";
import { preloadLikedBlogIds } from "@/app/lib/supabase/likeCache";
import { sanitizeCoverImage } from "@/app/lib/supabase/queries";

const SEARCH_LIMIT = 20;

const SEARCH_SELECT = `
  blog_id,
  title,
  excerpt,
  category,
  cover_image,
  created_at,
  published_at,
  view_count,
  like_count,
  profiles (
    name,
    avatar_url
  )
`;

const SEARCH_SELECT_FALLBACK = `
  blog_id,
  title,
  category,
  cover_image,
  created_at,
  profiles (
    name,
    avatar_url
  )
`;

function mapSearchRows(rows) {
  return (rows || []).map((article) => ({
    ...article,
    cover_image: sanitizeCoverImage(article.cover_image),
    excerpt: article.excerpt || "",
    like_count: article.like_count ?? 0,
    view_count: article.view_count ?? 0,
  }));
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    async function fetchSearchResults() {
      setLoading(true);

      // Search title/content/category, but do not SELECT full content (egress).
      const { data, error } = await supabase
        .from("blogs")
        .select(SEARCH_SELECT)
        .eq("is_published", true)
        .or(
          `title.ilike.%${query}%,content.ilike.%${query}%,category.ilike.%${query}%`,
        )
        .order("published_at", { ascending: false, nullsFirst: false })
        .limit(SEARCH_LIMIT);

      if (error) {
        const msg = (error.message || "").toLowerCase();
        if (
          msg.includes("like_count") ||
          msg.includes("published_at") ||
          msg.includes("blog_likes") ||
          msg.includes("view_count") ||
          msg.includes("relationship") ||
          msg.includes("schema cache")
        ) {
          const { data: fallback, error: fallbackError } = await supabase
            .from("blogs")
            .select(SEARCH_SELECT_FALLBACK)
            .eq("is_published", true)
            .or(
              `title.ilike.%${query}%,content.ilike.%${query}%,category.ilike.%${query}%`,
            )
            .order("created_at", { ascending: false })
            .limit(SEARCH_LIMIT);

          if (fallbackError) {
            console.error("Search error:", fallbackError);
            setArticles([]);
          } else {
            const list = mapSearchRows(fallback);
            setArticles(list);
            preloadLikedBlogIds(list.map((a) => a.blog_id)).catch(() => {});
          }
        } else {
          console.error("Search error:", error);
          setArticles([]);
        }
      } else {
        const list = mapSearchRows(data);
        setArticles(list);
        preloadLikedBlogIds(list.map((a) => a.blog_id)).catch(() => {});
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
    <Suspense
      fallback={
        <main className="grid-background min-h-screen">
          <section className="max-w-6xl mx-auto px-4 py-12">
            <p className="text-gray-400">Loading search...</p>
          </section>
        </main>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
