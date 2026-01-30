import styles from "@/styles/auth.module.css";

export default function Field({
  label,
  type,
  placeholder,
  value,
  onChange,
  rightEl,
}) {
  return (
    <div>
      <div className={rightEl ? styles.rowBetween : undefined}>
        <label className={styles.label}>{label}</label>
        {rightEl}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        className={styles.input}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
}
