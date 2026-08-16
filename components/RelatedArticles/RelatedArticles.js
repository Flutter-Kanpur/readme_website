import Link from "next/link";
import { getArticlePath } from "@/app/lib/blogSlug";
import "./styles.css";

export default function RelatedArticles({ articles = [] }) {
  if (!Array.isArray(articles) || articles.length === 0) {
    return null;
  }

  return (
    <div className="related-articles">
      <h4 className="related-title">Related Articles</h4>

      <ul className="related-list">
        {articles.map((article) => (
          <li key={article.blog_id} className="related-item">
            <Link href={getArticlePath(article)} prefetch>
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
