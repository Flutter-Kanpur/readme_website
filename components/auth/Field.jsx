import styles from "@/styles/auth.module.css";

export default function Field({ label, type, placeholder, rightEl }) {
  return (
    <div>
      <div className={rightEl ? styles.rowBetween : undefined}>
        <label className={styles.label}>{label}</label>
        {rightEl}
      </div>
      <input className={styles.input} type={type} placeholder={placeholder} />
    </div>
  );
}
