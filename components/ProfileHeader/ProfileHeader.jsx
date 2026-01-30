import './styles.css'
import Image from 'next/image'

export default function ProfileHeader({ profile }) {
  return (
    <div className='wrapper'>
      <Image
          src={profile.avatar_url}
          alt="avatar"
          width={96}
          height={96}
          className='avatar'
        />

      <div>
        <h2 className='name'>{profile.name}</h2>
        <p className='bio'>{profile.bio}</p>

        <div className='stats'>
          <span><b><span className='statsdata'>{profile.followers_count || 0}</span></b> Followers</span>
          <span><b><span className='statsdata'>{profile.following_count || 0}</span></b> Following</span>
          <span><b><span className='statsdata'>{profile.reads_count || 0}</span></b> Reads</span>
        </div>
      </div>
    </div>
  )
}