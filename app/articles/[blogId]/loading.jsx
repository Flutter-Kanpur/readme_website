import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import "./styles.css";

export default function ArticleLoading() {
  return (
    <div className="article-page">
      <Navbar />
      <div className="article-page-layout">
        <div className="article-container">
          <article className="article-main">
            <div className="skeleton-line skeleton-line--hero" />
            <div className="skeleton-author">
              <div className="skeleton-avatar" />
              <div className="skeleton-author-text">
                <div className="skeleton-line skeleton-line--name" />
                <div className="skeleton-line skeleton-line--meta" />
              </div>
            </div>
            <div className="skeleton-cover" />
            <div className="skeleton-content">
              <div className="skeleton-line" />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
              <div className="skeleton-line skeleton-line--short" />
              <div className="skeleton-line" />
              <div className="skeleton-line skeleton-line--medium" />
            </div>
          </article>

          <aside className="article-sidebar article-sidebar--loading">
            <div className="related-articles related-articles--skeleton" aria-hidden>
              <div className="skeleton-line skeleton-line--title" />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
              <div className="skeleton-line skeleton-line--short" />
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}
