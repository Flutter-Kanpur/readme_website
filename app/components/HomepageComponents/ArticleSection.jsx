"use client";

import { useState } from "react";
import ArticleCard from "./ArticleCard";
import ArticleFilters from "./Filters";
import { useArticlesData } from "../../hooks/useArticleData";

const FILTERS = [
  { label: "For You", value: "for_you" },
  { label: "Backend", value: "backend" },
  { label: "Design", value: "design" },
  { label: "Technology", value: "Technology" },
  { label: "React", value: "react" },
  { label: "DSA", value: "dsa" },
  { label: "UI", value: "UI" },
  { label: "Flutter", value: "flutter" },
];

export default function ArticlesSection() {
  const [activeFilter, setActiveFilter] = useState("for_you");
  const { blogs, loading } = useArticlesData(activeFilter);

  return (
    <section className="max-w-7xl mx-auto py-16 px-4">
      <ArticleFilters
        filters={FILTERS}
        activeFilter={activeFilter}
        onChange={setActiveFilter}
      />

      <div className="space-y-10 mt-10">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <ArticleCard key={i} />
          ))
        ) : blogs.length === 0 ? (
          <p className="text-gray-400">No articles found.</p>
        ) : (
          blogs.map((blog) => (
            <ArticleCard key={blog.blog_id} article={blog} />
          ))
        )}
      </div>
    </section>
  );
}
