import Link from "next/link";
import Image from "next/image";
import ArticleCardAuthorInfo from "@/components/ArticleCardAuthorInfo/ArticleCardAuthorInfo";
import ArticleCardEngagement from "@/app/components/ArticleCardEngagement";
import "./styles.css";

export default function ArticleCard({ blog }) {
  function htmlToText(html) {
    if (typeof window === "undefined") return "";
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }

  if (!blog) return null;

  return (
    <div className="card">
      <div className="content">
        <ArticleCardAuthorInfo author={blog.author} />

        {blog.cover_image && (
          <div className="image-wrap">
            <Image
              src={blog.cover_image}
              alt=""
              width={800}
              height={420}
              className="image"
            />
          </div>
        )}

        <h1 className="title">{blog.title}</h1>

        {(blog.excerpt || blog.content) ? (
          <p className="desc">
            {blog.excerpt ||
              `${htmlToText(blog.content).slice(0, 120)}${
                htmlToText(blog.content).length > 120 ? "..." : ""
              }`}
          </p>
        ) : null}

        <ArticleCardEngagement blog={blog} />

        <div className="meta">
          <span className="link">#{blog.category}</span>
          <Link href={`/articles/${blog.blog_id}`} className="link">
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
}
