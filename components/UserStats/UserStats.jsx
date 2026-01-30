import "./styles.css"
export default function UserStats({ profile }) {
  return (
    <div className = "box">
      <h5 className = "title">User Statistics</h5>

      <div className = "row">
        <span>Member Since </span>
        <span>
           {new Date(profile.created_at).toLocaleDateString()}
        </span>
      </div>

      <div className = "row">
        <span>Total Articles</span>
        <span>{profile.articles_count || 0}</span>
      </div>

      <div className = "row">
        <span>Article Saves</span>
        <span>{profile.saves_count || 0}</span>
      </div>

      <div className = "row">
        <span>Profile Views</span>
        <span>{profile.views_count || 0}</span>
      </div>
    </div>
  )
}
