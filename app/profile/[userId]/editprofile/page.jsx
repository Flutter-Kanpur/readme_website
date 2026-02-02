import './styles.css'
import EditProfileHeader from '@/components/EditProfileHeader/EditProfileHeader'
import EditProfileForm from '@/components/EditProfileForm/EditProfileForm'
import Preferences from '@/components/Preferences/Preferences'

export default function EditProfile() {
  return (
    <div className="edit-profile-page">
      <EditProfileHeader />

      <div className="edit-profile-layout">
        <EditProfileForm />
        <Preferences />
      </div>
    </div>
  )
}
