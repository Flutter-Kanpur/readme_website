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

      <CustomButton handleClick={onFollow} className= "w-full bg-black text-white px-4 py-2 rounded-full text-sm cursor-pointer hover:opacity-90 transition">
        Follow Author
      </CustomButton>

    </div>
  )
}
