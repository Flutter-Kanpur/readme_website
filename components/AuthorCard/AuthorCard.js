'use client'

import Link from 'next/link'
import CustomButton from '../Button/CustomButton'
import './styles.css'
import Image from 'next/image'

export default function AuthorCard({
  author,
  onFollow,
  isFollowing = false,
  actionLoading = false,
}) {
  if (!author) return null

  const avatarSrc = author.avatar_url || author.avatar || '/avatar.jpg'
  const profileHref = author.authorId ? `/profile/${author.authorId}` : '#'

  return (
    <div className="author-card">
      <div className="author-header">
        <Link href={profileHref} className="author-avatar-link">
          <Image
            src={avatarSrc}
            alt={author.name || 'Author avatar'}
            width={64}
            height={64}
            className="author-avatar"
          />
        </Link>
        <div className="author-info">
          {author.name && (
            <Link href={profileHref} className="author-name-link">
              <h3 className="author-name">{author.name}</h3>
            </Link>
          )}
          {author.headline && <p className="author-headline">{author.headline}</p>}
        </div>
      </div>

      {author.bio && (
        <p className="author-bio">
          {author.bio}
        </p>
      )}

      <CustomButton
        handleClick={onFollow}
        variant={isFollowing ? 'secondary' : 'primary'}
        disabled={actionLoading}
        className="author-card__follow-btn"
      >
        {actionLoading ? 'Updating…' : isFollowing ? 'Following' : 'Follow Author'}
      </CustomButton>
    </div>
  )
}
