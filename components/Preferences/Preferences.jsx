import './styles.css'

export default function PreferencesCard() {
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

      <button className="deactivate">Deactivate account</button>
    </div>
  )
}
