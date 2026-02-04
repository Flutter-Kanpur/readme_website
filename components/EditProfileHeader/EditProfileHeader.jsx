"use client"
import { useParams } from 'next/navigation'
import Link from 'next/link'
import './styles.css'

export default function EditProfileHeader() {
  const { userId } = useParams()
  return (
    <div className="profile-header">
      <Link href={`/profile/${userId}`} className="back-link">← Back to Profile</Link>
      <h1>Edit Profile</h1>
    </div>
  )
}
