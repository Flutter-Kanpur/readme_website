"use client";

import Image from "next/image";
import Link from "next/link";
import "./styles.css";

export default function ArticleCardAuthorInfo({ author, createdAt }) {
  if (!author) return null;

  const profileHref = author.authorId
    ? `/profile/${author.authorId}`
    : "#";

  return (
    <div className="wrapper">
      <Link href={profileHref} className="article-author-avatar-link">
        <Image
          src={author.avatar_url || "/avatar.jpg"}
          alt=""
          width={48}
          height={48}
          className="avatar"
        />
      </Link>

      <div>
        <Link href={profileHref} className="name article-author-name-link">
          {author.name}
        </Link>
        {createdAt && (
          <div className="article-meta">
            <span>{new Date(createdAt).toDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}
