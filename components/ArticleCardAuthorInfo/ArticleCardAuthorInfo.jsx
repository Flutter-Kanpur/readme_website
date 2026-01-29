import React from 'react'
import Image from 'next/image'
import './styles.css'

export default function ArticleCardAuthorInfo({author, createdAt}) {
    return (
        <div className='wrapper'>
            <Image
                src={author.avatar_url}
                alt="avatar"
                width={16}
                height={16}
                className='avatar'
            />

            <div>
                <p className = 'name'>{author.name}</p>
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