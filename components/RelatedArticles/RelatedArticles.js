"use client";

import { useRouter } from "next/navigation";
import "./styles.css";

export default function RelatedArticles({ articles = [] }) {
  const router = useRouter();

  if (!Array.isArray(articles) || articles.length === 0) {
    return null;
  }

  function handleClick(blogId) {
    router.push(`/articles/${blogId}`);
  }

  return (
    <div className="related-articles">
      <h4 className="related-title">Related Articles</h4>

      <ul className="related-list">
        {articles.map((article) => (
          <li
            key={article.blog_id}
            className="related-item"
            onClick={() => handleClick(article.blog_id)}
            style={{ cursor: "pointer" }}
          >
            {article.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
