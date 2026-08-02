"use client";

import { useState } from "react";
import ArticleCard from "./ArticleCard";
import ArticleFilters from "./Filters";
import { useArticlesData } from "../../hooks/useArticleData";
import { FEED_FILTERS } from "@/app/lib/taxonomy";

const FILTERS = FEED_FILTERS.map(({ label, value }) => ({ label, value }));

export default function ArticlesSection({
  initialBlogs,
  showTitle = true,
  className = "",
}) {
  const [activeFilter, setActiveFilter] = useState("for_you");
  // Liked-state preload lives in useArticlesData only (avoid duplicate egress).
  const { blogs, loading } = useArticlesData(activeFilter, initialBlogs);

  return (
    <section
      className={`max-w-7xl mx-auto ${showTitle ? "py-16 px-4 sm:px-6" : ""} ${className}`}
    >
      <ArticleFilters
        filters={FILTERS}
        activeFilter={activeFilter}
        onChange={setActiveFilter}
        title={showTitle ? "Latest Articles" : null}
      />

      <div className="space-y-6 mt-10">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <ArticleCard key={i} />
          ))
        ) : blogs.length === 0 ? (
          <p className="text-gray-500 text-center py-12 rounded-[28px] bg-white/80 border border-gray-200">
            No articles found.
          </p>
        ) : (
          blogs.map((blog) => (
            <ArticleCard key={blog.blog_id} article={blog} />
          ))
        )}
      </div>
    </section>
  );
}
