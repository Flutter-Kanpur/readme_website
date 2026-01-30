import GridBackground from "@/components/ui/GridBackground";
import styles from "@/styles/auth.module.css";

export default function AuthLayout({ children }) {
  return (
    <div className={styles.page}>
      <GridBackground />

    
      <main className={styles.card} style={{ position: "relative", zIndex: 1 }}>
        <div className={styles.twoCol}>{children}</div>
      </main>
    </div>
  );
}
