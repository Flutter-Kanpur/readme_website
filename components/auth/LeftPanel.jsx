import styles from "@/styles/auth.module.css";

export default function LeftPanel() {
  return (
    <section className={styles.left}>
      <div className={styles.brand}>Readme</div>

      <h1 className={styles.title}>
        A space for people who design with{" "}
        <span className={styles.passion}>passion.</span>
      </h1>

      <p className={styles.subtitle}>
        Join our reader-first community focused on learning, building, and growing together.
      </p>
    </section>
  );
}
