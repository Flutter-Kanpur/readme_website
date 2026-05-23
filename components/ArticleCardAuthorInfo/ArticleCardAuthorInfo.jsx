"use client";

import Image from "next/image";
import Link from "next/link";
import "./styles.css";

export default function ArticleCardAuthorInfo({
  author,
  coauthors = [],
  community,
  createdAt,
}) {
  const authors = [author, ...coauthors].filter(Boolean);
  if (authors.length === 0) return null;

  const authorLine = authors.map((item) => item.name).filter(Boolean).join(", ");
  const primary = authors[0];
  const profileHref = primary.authorId ? `/profile/${primary.authorId}` : "#";

  return (
    <div className="article-byline">
      {community?.slug && (
        <Link
          href={`/communities/${community.slug}`}
          className="article-community-badge"
        >
          {community.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={community.logo_url} alt="" className="article-community-badge__logo" />
          ) : null}
          {community.name}
        </Link>
      )}

      <div className="wrapper">
        <Link href={profileHref} className="article-author-avatar-link">
          <Image
            src={primary.avatar_url || "/avatar.jpg"}
            alt=""
            width={48}
            height={48}
            className="avatar"
          />
        </Link>

        <div>
          <Link href={profileHref} className="name article-author-name-link">
            {authorLine}
          </Link>
          {authors.length > 1 && (
            <div className="article-meta">
              <span>{authors.length} authors</span>
            </div>
          )}
          {createdAt && (
            <div className="article-meta">
              <span>{new Date(createdAt).toDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
