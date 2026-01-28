import Image from "next/image";
import Link from "next/link";

const styles = {
  page: {
    position: "relative",
    height: "100vh",
    display: "grid",
    placeItems: "center",
    backgroundColor: "#F8FAFC",
    color: "#111827",
    fontFamily: "var(--font-product-sans)",
    padding: 24,
    overflow: "hidden",
  },

  gridBg: {
    pointerEvents: "none",
    position: "absolute",
    inset: 0,
    zIndex: -1,
    backgroundImage:
      "linear-gradient(to right, rgba(0,0,0,.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,.06) 1px, transparent 1px)",
    backgroundSize: "24px 24px",
  },

  card: {
    width: "80%",
    maxWidth: 1024,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#fff",
    boxShadow: "0 30px 60px rgba(0,0,0,0.15)",
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
  },

  left: {
    backgroundColor: "#000",
    color: "#fff",
    padding: 48,
  },

  brand: { fontSize: 20, fontWeight: 600 },
  title: { fontSize: 40, fontWeight: 700, lineHeight: 1.1, margin: 0 },
  passion: { color: "#2563EB" },
  subtitle: {
    maxWidth: 280,
    color: "#ababab",
    margin: 0,
    fontSize: 18,
    lineHeight: 1.8,
  },

  right: { backgroundColor: "#fff", padding: 48 },
  rightInner: { width: "100%", maxWidth: 420, margin: "0 auto" },

  header: { marginBottom: 32 },
  h2: { fontSize: 24, fontWeight: 700, margin: 0 },
  p: { marginTop: 8, marginBottom: 0, fontSize: 14, color: "#6B7280" },

  form: { display: "flex", flexDirection: "column", gap: 20 },
  label: {
    display: "block",
    marginBottom: 8,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "#000",
  },
  input: {
    width: "100%",
    borderRadius: 12,
    border: "1px solid #E5E7EB",
    backgroundColor: "#F3F4F6",
    padding: "12px 16px",
    fontSize: 14,
  },

  button: {
    width: "100%",
    border: "none",
    borderRadius: 12,
    padding: "12px 16px",
    backgroundColor: "#000",
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },

  divider: { display: "flex", alignItems: "center", margin: "18px 0" },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E5E7EB" },
  dividerText: { padding: "0 10px", fontSize: 12, color: "#9CA3AF" },

  googleBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderRadius: 12,
    border: "1px solid #E5E7EB",
    backgroundColor: "#fff",
    padding: "12px 16px",
    fontSize: 14,
    fontWeight: 600,
  },

  footer: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 14,
    color: "#4B5563",
  },
  linkFooter: { color: "#3BB2F6", textDecoration: "none", fontWeight: 600 },
};

const Field = ({ label, type, placeholder }) => (
  <div>
    <label style={styles.label}>{label}</label>
    <input type={type} placeholder={placeholder} style={styles.input} />
  </div>
);

const Divider = () => (
  <div style={styles.divider}>
    <div style={styles.dividerLine} />
    <span style={styles.dividerText}>OR</span>
    <div style={styles.dividerLine} />
  </div>
);

const LeftPanel = () => (
  <section style={styles.left}>
    <div style={styles.brand}>Readme</div>
    <h1 style={styles.title}>
      A space for people who design with{" "}
      <span style={styles.passion}>passion.</span>
    </h1>
    <p style={styles.subtitle}>
      Join our reader-first community focused on learning, building, and growing
      together.
    </p>
  </section>
);

const RightPanel = () => {
  const fields = [
    { label: "FULL NAME", type: "text", placeholder: "Jane Doe" },
    { label: "EMAIL ADDRESS", type: "email", placeholder: "name@example.com" },
    { label: "PASSWORD", type: "password", placeholder: "••••••••" },
  ];

  return (
    <section style={styles.right}>
      <div style={styles.rightInner}>
        <header style={styles.header}>
          <h2 style={styles.h2}>Join the community</h2>
          <p style={styles.p}>Start your design journey with Readme today.</p>
        </header>

        <form style={styles.form}>
          {fields.map((f) => (
            <Field
              key={f.label}
              label={f.label}
              type={f.type}
              placeholder={f.placeholder}
            />
          ))}

          <button type="submit" style={styles.button}>
            Create account →
          </button>
        </form>

        <Divider />

        <button style={styles.googleBtn} type="button">
          <Image src="/google.png" alt="Google" width={20} height={20} />
          Continue with Google
        </button>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link href="/" style={styles.linkFooter}>
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
};

export default function Register() {
  return (
    <div style={styles.page}>
      <div style={styles.gridBg} />
      <main style={styles.card}>
        <div style={styles.layout}>
          <LeftPanel />
          <RightPanel />
        </div>
      </main>
    </div>
  );
}
