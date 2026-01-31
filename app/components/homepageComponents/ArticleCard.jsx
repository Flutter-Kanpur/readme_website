function SkeletonLine({ className }) {
  return <div className={`bg-gray-200 rounded ${className}`} />;
}

function ArticleSkeleton() {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-6 flex justify-between items-center gap-6 animate-pulse">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-3">
          <SkeletonLine className="w-8 h-8 rounded-full" />
          <SkeletonLine className="h-3 w-24" />
          <SkeletonLine className="h-3 w-20" />
        </div>

        <SkeletonLine className="h-6 w-3/4 mb-3" />

        <div className="space-y-2">
          <SkeletonLine className="h-3 w-full" />
          <SkeletonLine className="h-3 w-5/6" />
        </div>

        <div className="flex items-center gap-4 mt-4">
          <SkeletonLine className="h-3 w-20" />
          <SkeletonLine className="h-3 w-24" />
        </div>
      </div>

      <SkeletonLine className="w-[160px] h-[120px] rounded-xl" />
    </div>
  );
}

export default function ArticleCard({ article }) {
  if (!article) {
    return <ArticleSkeleton />;
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-6 flex justify-between items-center gap-6">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={article.author_avatar}
            alt={article.author}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-xs text-gray-500">{article.author}</span>
          <span className="text-xs text-gray-400">{article.category}</span>
        </div>

        <h3 className="text-lg font-semibold text-black mb-2">
          {article.title}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-2">
          {article.description}
        </p>

        <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
          <span>{article.read_time} min read</span>
          <span>{article.views} views</span>
        </div>
      </div>

      {article.image && (
        <img
          src={article.image}
          alt={article.title}
          className="w-[160px] h-[120px] rounded-xl object-cover"
        />
      )}
    </div>
  );
}
