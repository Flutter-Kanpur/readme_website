'use client';

import AuthorCard from '@/components/AuthorCard/AuthorCard';
import useFollowAuthor from '@/app/hooks/useFollowAuthor';

function SingleAuthorCard({ author }) {
  const { isFollowing, isLoading, isSelf, actionLoading, toggleFollow } =
    useFollowAuthor(author.authorId);

  if (!author?.authorId) return null;
  if (isLoading) return null;
  if (isSelf) return null;

  return (
    <AuthorCard
      author={author}
      isFollowing={isFollowing}
      actionLoading={actionLoading}
      onFollow={toggleFollow}
    />
  );
}

export default function AuthorCardSection({ authors = [] }) {
  const list = authors.filter((author) => author?.authorId);
  if (list.length === 0) return null;

  return (
    <section className="article-authors-stack" aria-label="Authors">
      {list.map((author) => (
        <SingleAuthorCard key={author.authorId} author={author} />
      ))}
    </section>
  );
}
