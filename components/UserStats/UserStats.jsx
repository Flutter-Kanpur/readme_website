import styles from "./styles.module.css"

export default function UserStats({
  profile,
  articleCount = 0,
  followers = 0,
  following = 0,
}) {
  return (
    <div className={styles.box}>
      <div className={styles.title}>User Statistics</div>

      <div className={styles.row}>
        <span>Member Since</span>
        <span>
          {profile?.created_at
            ? new Date(profile.created_at).toLocaleDateString()
            : '—'}
        </span>
      </div>

      <div className={styles.row}>
        <span>Followers</span>
        <span>{followers}</span>
      </div>

      <div className={styles.row}>
        <span>Following</span>
        <span>{following}</span>
      </div>

      <div className={styles.row}>
        <span>Total Articles</span>
        <span>{articleCount}</span>
      </div>
    </div>
  )
}
