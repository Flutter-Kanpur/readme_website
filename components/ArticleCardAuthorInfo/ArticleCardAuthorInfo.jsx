import React from 'react'
import Image from 'next/image'
import './styles.css'

export default function ArticleCardAuthorInfo({author, createdAt, handleAuthorProfile}) {
    return (
        <div className='wrapper'>
            <Image
                src={author.avatar_url}
                alt="avatar"
                width={16}
                height={16}
                className='avatar'
                onClick={handleAuthorProfile}
            />

            <div>
                <p className = 'name' onClick={handleAuthorProfile}>{author.name}</p>
                {createdAt && (
                        <div className="article-meta">
                            <span>
                                {new Date(createdAt).toDateString()}
                            </span>
                        </div>
                    )}
            </div>
        </div>
    )
}