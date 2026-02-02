import Link from 'next/link'
import './styles.css'

export default function EditProfileHeader() {
  return (
    <div className="profile-header">
      <Link href="/profile" className="back-link">← Back to Profile</Link>
      <h1>Edit Profile</h1>
    </div>
  )
}
