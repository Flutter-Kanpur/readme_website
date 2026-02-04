import styles from './styles.module.css'

export default function SocialLinks() {
  return (
    <div className={styles.socialLinks}>
      <label className={styles.label}>SOCIAL LINKS</label>
    <div className= {styles.social}>
      <div className={styles.row}>
        <input
          className={styles.input}
          type="text"
          placeholder="Twitter URL"
        />
      </div>

      <div className={styles.row}>
        <input
          className={styles.input}
          type="text"
          placeholder="LinkedIn URL"
        />
      </div>
</div>
      <div className={styles.row}>
        <input
          className={styles.input}
          type="text"
          placeholder="Personal Website URL"
        />
      </div>
    </div>
  )
}
