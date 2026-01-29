import React from 'react'
import Image from 'next/image'
import './styles.css'

export default function ArticleCardAuthorInfo({author}){
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
            </div>
        </div>
    )
}

// const styles = {
//   wrapper: {
//     display: 'flex',
//     gap: '10px',
//   },
//   avatar: {
//     width: '26px',
//     height: '26px',
//     borderRadius: '50%',
//     objectFit: 'cover',
//     cursor: 'pointer'
//   },
//   name: {
//     fontSize: '16px',
//     fontWeight: '100',
//     margin: 0,
//     color: '#000'
//   },
// }