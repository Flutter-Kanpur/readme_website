import Link from "next/link";
import Image from "next/image";
import ArticleCardAuthorInfo from "@/components/ArticleCardAuthorInfo/ArticleCardAuthorInfo";
import "./styles.css";

export default function ArticleCard({ blog }) {
  
function htmlToText(html) {
  if (typeof window === "undefined") return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

  return (
    <div className='card'>
      <div className='content'>
        <div>
          <ArticleCardAuthorInfo author={blog.author} />
        </div>

        <h1 className='title'>{blog.title}</h1>

        <p className='desc'>
          {(htmlToText(blog.content).slice(0, 120))}...
        </p>

        <div className='meta'>
          <span className='link'>#{blog.category}</span>
          <Link
            href={`/articles/${blog.blog_id}`}
            className='link'
          >
            Read More →
          </Link>
        </div>
      </div>

      {blog.cover_image && (
        <Image
          src={blog.cover_image}
          alt="cover"
          width={160}
          height={200}
          className='image'
        />
      )}
    </div>
  );
}