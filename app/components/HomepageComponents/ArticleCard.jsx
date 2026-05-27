import Image from "next/image";
import Link from "next/link";

function getAuthorLine(article) {
  const primary = article.profiles?.name || "Anonymous";
  const coNames = (article.blog_coauthors ?? [])
    .map((row) => row.profiles?.name)
    .filter(Boolean);

  if (coNames.length === 0) return primary;
  return `${primary}, ${coNames.join(", ")}`;
}

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
    communities,
    blog_coauthors = [],
  } = article;

  const preview =
    excerpt || htmlToText(content).slice(0, 320).trim();

  const authorLine = getAuthorLine({ profiles, blog_coauthors });
  const allAuthors = [
    {
      name: profiles?.name,
      avatar: profiles?.avatar_url,
    },
    ...blog_coauthors.map((row) => ({
      name: row.profiles?.name,
      avatar: row.profiles?.avatar_url,
    })),
  ].filter((author) => author.name);
  const visibleAuthors = allAuthors.slice(0, 3);
  const extraAuthorCount = Math.max(0, allAuthors.length - visibleAuthors.length);
  const coverImage =
    cover_image && cover_image.trim() !== "" ? cover_image : null;
  const community = communities;

  return (
    <Link href={`/articles/${blog_id}`} className="block transition-all hover:scale-[1.01] active:scale-[0.99] group">
      <div className="bg-white p-6 md:p-8 rounded-[28px] border border-gray-200 shadow-sm flex flex-col-reverse md:flex-row justify-between gap-6 md:gap-12 transition-all hover:border-gray-300 hover:shadow-md">

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {community?.slug && (
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                {community.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={community.logo_url} alt="" className="w-4 h-4 rounded-full object-cover" />
                ) : null}
                {community.name}
              </span>
            )}
            <span className="text-[10px] uppercase tracking-wider text-blue-500 font-bold">{category}</span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center -space-x-2 shrink-0">
              {visibleAuthors.map((author, idx) => (
                <Image
                  key={`${author.name}-${idx}`}
                  src={
                    author.avatar && author.avatar.trim() !== ""
                      ? author.avatar
                      : "/avatar.jpg"
                  }
                  alt={author.name || ""}
                  width={36}
                  height={36}
                  className="rounded-full object-cover ring-2 ring-white bg-gray-100"
                  style={{ zIndex: visibleAuthors.length - idx }}
                />
              ))}
              {extraAuthorCount > 0 && (
                <span
                  className="flex items-center justify-center rounded-full bg-gray-100 text-[10px] font-semibold text-gray-600 ring-2 ring-white"
                  style={{ width: 36, height: 36 }}
                >
                  +{extraAuthorCount}
                </span>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-black leading-snug truncate">{authorLine}</span>
              {blog_coauthors.length > 0 && (
                <span className="text-[10px] text-gray-400">
                  {1 + blog_coauthors.length} authors
                </span>
              )}
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
