"use client";

import ArticleCard from "./ArticleCard";
import { useArticlesData } from "../../hooks/useArticleData";

export default function ArticlesSection() {
  const { blogs = [], loading } = useArticlesData();


  return (
    <section className="max-w-7xl mx-auto py-16 px-4">
      <div className="flex flex-col lg:flex-row gap-14">
        <div className="flex-1">
           <h2 className="text-2xl font-semibold mb-6 text-black">
        Latest Articles
      </h2>
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
        </div>


        </div>
    </section>
  );
}
