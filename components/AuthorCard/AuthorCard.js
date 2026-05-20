'use client'

import CustomButton from '../Button/CustomButton'
import './styles.css'
import Image from 'next/image'

export default function AuthorCard({ author, onFollow }) {
  if (!author) return null

  return (
    <div className="author-card">
      <div className="author-header">
        {author.avatar && (
          <Image
            src={author.avatar}
            alt={author.name || 'Author avatar'}
            width={64}
            height={64}
            className="author-avatar"
          />
        )}
        <div className="author-info">
          {author.name && <h3 className="author-name">{author.name}</h3>}
          {author.headline && <p className="author-headline">{author.headline}</p>}
        </div>
      </div>

      {author.bio && (
        <p className="author-bio">
          {author.bio}
        </p>
      )}

      <CustomButton handleClick={onFollow} variant="primary" styles={{ width: '100%', marginTop: 'auto' }}>
        Follow Author
      </CustomButton>
    </div>
  )
}
