"use client";

import Link from "next/link";
import ArticleCard from "./ArticleCard";
import { useArticlesData } from "../../hooks/useArticleData";

/**
 * Homepage teaser: latest few articles only (see HOME_FEED_LIMIT in
 * app/lib/data/feed.js). Full browsing — all articles, filters — lives on
 * /articles; this section always renders the "for_you" filter it was
 * seeded with, so it never re-fetches past the SSR'd initialBlogs.
 */
export default function HomeArticleSection({ initialBlogs }) {
  const { blogs, loading } = useArticlesData("for_you", initialBlogs);

  return (
    <section className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-black tracking-tight mb-6">
        Latest Articles
      </h2>

      <div className="space-y-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <ArticleCard key={i} />)
        ) : blogs.length === 0 ? (
          <p className="text-gray-500 text-center py-12 rounded-[28px] bg-white/80 border border-gray-200">
            No articles found.
          </p>
        ) : (
          blogs.map((blog) => <ArticleCard key={blog.blog_id} article={blog} />)
        )}
      </div>

      <div className="flex justify-center mt-10">
        <Link href="/articles">
          <button className="bg-white border border-gray-200 px-8 py-4 rounded-full text-sm font-bold text-black hover:bg-gray-50 transition-all cursor-pointer shadow-sm active:scale-95">
            View all articles →
          </button>
        </Link>
      </div>
    </section>
  );
}
