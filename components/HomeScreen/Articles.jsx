"use client";
import ArticleCard from "./ArticleCard";
import Filters from "./Filters";
import TrendingNow from "./TrendingNow";
import TopWriters from "./TopWriters";
import { useState } from "react";

export default function ArticlesSection() {
  const [activeFilter, setActiveFilter] = useState(null);

  const filters = [];
  const articles = [];
  const trends = [];
  const writers= [];
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
            {articles.length === 0 ? (
              <>
                <ArticleCard />
                <ArticleCard />
                <ArticleCard />
              </>
            ) : (
              articles.map((article, index) => (
                <ArticleCard key={index} article={article} />
              ))
            )}
          </div>
        </div>

        <div className="w-full lg:w-[320px] space-y-12">
          
          <div>
            <TrendingNow trends={trends} />
          </div>

          <TopWriters writers={writers} />

        </div>
      </div>
    </section>
  );
}
