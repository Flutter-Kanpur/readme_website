import "./styles.css";

export default function RelatedArticlesSidebarSkeleton() {
  return (
    <div className="related-articles related-articles--skeleton" aria-hidden>
      <div className="skeleton-line skeleton-line--title" />
      <div className="skeleton-line" />
      <div className="skeleton-line" />
      <div className="skeleton-line skeleton-line--short" />
    </div>
  );
}
