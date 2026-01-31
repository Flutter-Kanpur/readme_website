"use client";
import { useState } from "react";
import ArticleCard from "./ArticleCard";
import Filters from "./Filters";
import TrendingNow from "./TrendingNow";
import TopWriters from "./TopWriters";
import { useArticlesData } from "../../hooks/useArticleData";

const SKELETON_COUNT = 3;

export default function ArticlesSection() {
  const [activeFilter, setActiveFilter] = useState(null);
  const {
    articles,
    filters,
    trends,
    writers,
    loading,
  } = useArticlesData();
  

  return (
    <section className="max-w-7xl mx-auto py-16 px-4">
      <div className="flex flex-col lg:flex-row gap-14">
        <div className="flex-1">
          <Filters
            filters={filters}
            activeFilter={activeFilter}
            onChange={setActiveFilter}
          />
          <div className="space-y-10 mt-10">
            {loading ? (
              Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <ArticleCard key={i} />
              ))
            ) : articles.length === 0 ? (
              <p className="text-gray-400">No articles found.</p>
            ) : (
              articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))
            )}
          </div>
        </div>
        <div className="w-full lg:w-[320px] space-y-12">
          <TrendingNow trends={trends} />
          <TopWriters writers={writers} />
        </div>
      </div>
    </section>
  );
}
