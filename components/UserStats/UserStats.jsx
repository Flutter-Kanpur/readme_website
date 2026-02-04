import styles from "./styles.module.css"
export default function UserStats({ profile }) {
  return (
    <div className = {styles.box}>
      <div className = {styles.title}>User Statistics</div>

      <div className = {styles.row}>
        <span>Member Since </span>
        <span>
           {new Date(profile.created_at).toLocaleDateString()}
        </span>
      </div>

      <div className = {styles.row}>
        <span>Total Articles</span>
        <span>{profile.articles_count || 0}</span>
      </div>

      <div className = {styles.row}>
        <span>Article Saves</span>
        <span>{profile.saves_count || 0}</span>
      </div>

      <div className = {styles.row}>
        <span>Profile Views</span>
        <span>{profile.views_count || 0}</span>
      </div>
    </div>
  )
}
