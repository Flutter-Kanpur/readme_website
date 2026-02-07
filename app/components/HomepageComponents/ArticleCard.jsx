import Image from "next/image";
import Link from "next/link";

export default function ArticleCard({ article }) {
  if (!article) return null;

  function htmlToText(html) {
  if (typeof window === "undefined") return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

  const {
    blog_id,
    title = "Untitled",
    content = "",
    cover_image,
    category = "General",
    profiles,
  } = article;

  const author = profiles?.name || "Anonymous";
  const authorAvatar =
    profiles?.avatar_url && profiles.avatar_url.trim() !== ""
      ? profiles.avatar_url
      : "/avatar.jpg"; 
  const coverImage =
    cover_image && cover_image.trim() !== "" ? cover_image : null;

  return (
    <Link href={`/articles/${blog_id}`} className="block">
      <div style={{background: "#fff",padding: "20px",borderRadius: "12px",display: "flex",justifyContent: "space-between",gap: "20px",boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",overflow: "hidden",}}>
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex items-center gap-3 mb-3">
          <Image
            src={authorAvatar}
            alt={author}
            width={32}
            height={32}
            className="rounded-full object-cover"
          />

          <span className="text-xs text-gray-500">{author}</span>
          <span className="text-xs text-gray-400">{category}</span>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-black">
          {title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 break-words overflow-hidden">
          {htmlToText(content).slice(0, 1200) || "No description available."}
        </p>
      </div>

      {coverImage && (
        <Image
          src={coverImage}
          alt={title}
          width={160}
          height={120}
          className="rounded-xl object-cover shrink-0"
        />
      )}
      </div>
    </Link>
  );
}
