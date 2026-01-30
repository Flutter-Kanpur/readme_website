'use client'

import CustomButton from '../Button/CustomButton'
import './styles.css'
import Image from 'next/image'

export default function AuthorCard({ author, onFollow }) {
  if (!author) return null

  return (
    <div className="author-card">
      {author.avatar && (
        <Image
          src={author.avatar}
          alt={author.name || 'Author avatar'}
          width={80}
          height={80}
          className="author-avatar"
        />
      )}

      {author.name && (
        <h3 className="author-name">
          {author.name}
        </h3>
      )}

      {author.bio && (
        <p className="author-bio">
          {author.bio}
        </p>
      )}

      <CustomButton handleClick={onFollow} styles={{
        width: "100%",
        backgroundColor: "#000000",
        color: "#ffffff",
        padding: "8px 16px",
        borderRadius: "9999px",
        fontSize: "14px",
        cursor: "pointer",
      }}>
        Follow Author
      </CustomButton>

    </div>
  )
}
