'use client'
import './styles.css'
import { useState } from 'react'
import { supabase } from '@/app/lib/supabase/index'

export default function PreferencesCard({ profile }) {

  const [loading, setLoading] = useState(false)
  const handleDeactivate = async () => {
    if (!confirm('Deactivate your account?')) return

    setLoading(true)
    const { data: { user }, error: authError } =
      await supabase.auth.getUser();

    if (authError || !user) {
      alert('Not authenticated');
      setLoading(false);
      return;
    }

    console.log('AUTH USER ID:', user.id);
    console.log('PROFILE PROP ID:', profile?.id);

    const { data, error } = await supabase
      .from('profiles')
      .update({ is_active: false })
      .eq('id', user.id)
      .select();

    console.log('UPDATE RESULT:', data, error);

    if (error) {
      alert(error.message)
      return
    }
    setLoading(false)
    await supabase.auth.signOut()
    window.location.href = '/'
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

      <button className="deactivate"
        onClick={handleDeactivate}
      >Deactivate account</button>
    </div>
  )
}
