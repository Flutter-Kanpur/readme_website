"use Client"
import './styles.css'
import { useState } from 'react'
import { supabase } from '@/app/lib/supabase/index'

export default function PreferencesCard({profile}) {

  const [loading, setLoading] = useState(false)
  const handleDeactivate = async () => {
    if (!confirm('Are you sure? This will permanently delete your account and all data.')) {
      return
    }

    try {
      setLoading(true)

      // 1. Delete profile row first
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profile.id)

      if (profileError) throw profileError

      // 2. Sign out user (this deletes their auth.users session)
      const { error: signoutError } = await supabase.auth.signOut()

      if (signoutError) throw signoutError

      // 3. Redirect to home (or wherever)
      window.location.href = '/'

    } catch (error) {
      console.error('Delete failed:', error)
      alert('Failed to delete account: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="preferences-card">
      <h4>Preferences</h4>

      <div className="section">
        <p className="section-title">Email Notifications</p>
        <label><input type="checkbox" defaultChecked /> Weekly digest of top reads</label>
        <label><input type="checkbox" defaultChecked /> New followers</label>
        <label><input type="checkbox" /> Community announcements</label>
      </div>

      <div className="section">
        <p className="section-title">Privacy Settings</p>
        <label><input type="checkbox" /> Make profile private</label>
        <label><input type="checkbox" defaultChecked /> Show reading statistics</label>
      </div>

      <button className="deactivate" onClick={handleDeactivate}>Deactivate account</button>
    </div>
  )
}
