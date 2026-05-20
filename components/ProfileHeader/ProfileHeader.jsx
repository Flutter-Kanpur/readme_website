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
        {profile.headline && (
          <p className={styles.headline}>
            {profile.headline}
          </p>
        )}
        <p className={styles.bio}>{profile.bio}</p>
      </div>
    </div>
  )
}