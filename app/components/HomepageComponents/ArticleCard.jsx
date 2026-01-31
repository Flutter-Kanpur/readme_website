import Image from "next/image";

export default function ArticleCard({ article }) {
  if (!article) return null;

  const {
    title,
    content,
    cover_image,
    category,
    profiles,
  } = article;

  const author = profiles?.name || "Anonymous";
  const authorAvatar = profiles?.avatar_url ;

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-6 flex justify-between gap-6">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-3">
          <Image
            src={authorAvatar}
            alt={author}
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="text-xs text-gray-500">{author}</span>
          <span className="text-xs text-gray-400">{category}</span>
        </div>

        <h3 className="text-lg font-semibold mb-2">{title}</h3>

        <p className="text-sm text-gray-500 line-clamp-2">
          {content}
        </p>
      </div>

      {cover_image && (
        <Image
          src={cover_image}
          alt={title}
          width={160}
          height={120}
          className="rounded-xl object-cover"
        />
      )}
    </div>
  );
}
