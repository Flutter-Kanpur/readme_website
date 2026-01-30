import styles from "@/styles/auth.module.css";

export default function Divider() {
  return (
    <div className={styles.divider}>
      <div className={styles.dividerLine} />
      <span className={styles.dividerText}>OR</span>
      <div className={styles.dividerLine} />
    </div>
  );
}
