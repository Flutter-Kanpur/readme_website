import Image from "next/image";
import Link from "next/link";

export default function ArticleCard({ article }) {
  if (!article) return null;

  function htmlToText(html) {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ");
  }

  const {
    blog_id,
    title = "Untitled",
    excerpt = "",
    content = "",
    cover_image,
    category = "General",
    profiles,
  } = article;

  const preview =
    excerpt || htmlToText(content).slice(0, 320).trim();

  const author = profiles?.name || "Anonymous";
  const authorAvatar =
    profiles?.avatar_url && profiles.avatar_url.trim() !== ""
      ? profiles.avatar_url
      : "/avatar.jpg"; 
  const coverImage =
    cover_image && cover_image.trim() !== "" ? cover_image : null;

  return (
    <Link href={`/articles/${blog_id}`} className="block transition-all hover:scale-[1.01] active:scale-[0.99] group">
      <div className="bg-white p-6 md:p-8 rounded-[28px] border border-gray-200 shadow-sm flex flex-col-reverse md:flex-row justify-between gap-6 md:gap-12 transition-all hover:border-gray-300 hover:shadow-md">
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-4">
            <Image
              src={authorAvatar}
              alt={author}
              width={36}
              height={36}
              className="rounded-full object-cover ring-2 ring-gray-100"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-black leading-none mb-0.5">{author}</span>
              <span className="text-[10px] uppercase tracking-wider text-blue-500 font-bold">{category}</span>
            </div>
          </div>

          <h3 className="text-xl md:text-2xl font-bold mb-3 text-black group-hover:text-blue-600 transition-colors leading-snug">
            {title}
          </h3>
          
          <p className="text-sm md:text-base text-gray-500 line-clamp-3 md:line-clamp-2 leading-relaxed">
            {preview || "No description available."}
          </p>
        </div>

        {coverImage && (
          <div className="relative w-full md:w-[240px] aspect-[16/10] md:aspect-auto md:h-[160px] shrink-0">
            <Image
              src={coverImage}
              alt={title}
              fill
              className="rounded-[22px] object-cover shadow-sm group-hover:shadow-md transition-shadow"
            />
          </div>
        )}
      </div>
    </Link>
  );
}
