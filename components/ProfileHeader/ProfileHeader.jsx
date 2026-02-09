import styles from './styles.module.css'
import Image from 'next/image'

export default function ProfileHeader({ profile }) {
  return (
    <div className={styles.wrapper}>
      <Image
          src={profile.avatar_url || '/avatar.jpg'}
          alt="avatar"
          width={96}
          height={96}
          className= {styles.avatar}
        />

      <div>
        <h2 className={styles.name}>{profile.name}</h2>
        <p className={styles.bio}>{profile.bio}</p>

        <div className='stats'>
          <span><b><span className={styles.statsdata}>{profile.followers_count || 0}</span></b> Followers </span>
          <span><b><span className={styles.statsdata}>{profile.following_count || 0}</span></b> Following </span>
          <span><b><span className={styles.statsdata}>{profile.reads_count || 0}</span></b> Reads</span>
        </div>
      </div>
    </div>
  )
}