"use client";

import AuthorCard from "@/components/AuthorCard/AuthorCard";
import useFollowAuthor from "@/app/hooks/useFollowAuthor";

export default function AuthorCardSection({ author, authorId }) {
  const { isFollowing, isLoading, isSelf, actionLoading, toggleFollow } =
    useFollowAuthor(authorId);

  if (!author || !authorId) return null;
  if (isLoading) return null;
  if (isSelf) return null;

  return (
    <AuthorCard
      author={{
        ...author,
        authorId: author.authorId ?? authorId,
      }}
      isFollowing={isFollowing}
      actionLoading={actionLoading}
      onFollow={toggleFollow}
    />
  );
}
