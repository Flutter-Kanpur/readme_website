import Image from "next/image";
import Link from "next/link";

const styles = {
  page: {
    position: "relative",
    height: "100vh",
    display: "grid",
    placeItems: "center",
    fontFamily: "var(--font-product-sans)",
    color: "#111827",
    backgroundColor: "#F8FAFC",
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
    maxWidth: 800,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#fff",
    boxShadow: "0 30px 60px rgba(0,0,0,0.15)",
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
  },

  left: { background: "#000", color: "#fff", padding: "32px" },
  brand: { fontSize: 20, fontWeight: 700 },
  title: { fontSize: 40, fontWeight: 700, lineHeight: 1.1, margin: 0 },
  passion: { color: "#2563EB" },
  subtitle: {
    maxWidth: 280,
    color: "#ababab",
    margin: 0,
    fontSize: 16,
    lineHeight: 1.8,
  },

  right: { background: "#fff", padding: "28px 32px" },
  rightInner: { width: "100%", maxWidth: 420, margin: "0 auto" },
  headingWrap: { marginBottom: 32 },
  h2: { fontSize: 24, fontWeight: 700, margin: 0, color: "#111827" },
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
    color: "#111827",
    outline: "none",
    boxSizing: "border-box",
  },
  rowBetween: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  linkSmall: {
    fontSize: 12,
    fontWeight: 700,
    color: "#3BB2F6",
    textDecoration: "none",
  },

  btn: {
    width: "100%",
    border: "none",
    borderRadius: 12,
    padding: "12px 16px",
    backgroundColor: "#000",
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
  },

  divider: { display: "flex", alignItems: "center", margin: "18px 0" },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E5E7EB" },
  dividerText: {
    padding: "0 10px",
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: 500,
  },

  googleWrap: { marginTop: 24 },
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
    color: "#111827",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },

  footerText: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 14,
    color: "#4B5563",
  },
  footerLink: {
    fontWeight: 600,
    color: "#3BB2F6",
    textDecoration: "none",
  },
};

function Divider() {
  return (
    <div style={styles.divider}>
      <div style={styles.dividerLine} />
      <span style={styles.dividerText}>OR</span>
      <div style={styles.dividerLine} />
    </div>
  );
}

function Field({ label, type, placeholder, rightEl }) {
  return (
    <div>
      <div style={rightEl ? styles.rowBetween : undefined}>
        <label style={styles.label}>{label}</label>
        {rightEl}
      </div>
      <input type={type} placeholder={placeholder} style={styles.input} />
    </div>
  );
}

function LeftPanel() {
  return (
    <section style={styles.left}>
      <div style={styles.brand}>Readme</div>

      <h1 style={styles.title}>
        A space for people who design with{" "}
        <span style={styles.passion}>passion.</span>
      </h1>

      <p style={styles.subtitle}>
        Join our reader-first community focused on learning, building, and growing together.
      </p>
    </section>
  );
}

function RightPanel() {
  const fields = [
    { label: "EMAIL ADDRESS", type: "email", placeholder: "name@example.com" },
    {
      label: "PASSWORD",
      type: "password",
      placeholder: "••••••••",
      rightEl: (
        <Link href="#" style={styles.linkSmall}>
          FORGOT PASSWORD?
        </Link>
      ),
    },
  ];

  return (
    <section style={styles.right}>
      <div style={styles.rightInner}>
        <header style={styles.headingWrap}>
          <h2 style={styles.h2}>Welcome back</h2>
          <p style={styles.p}>Please enter your details to sign in.</p>
        </header>

        <form style={styles.form}>
          {fields.map((f) => (
            <Field
              key={f.label}
              label={f.label}
              type={f.type}
              placeholder={f.placeholder}
              rightEl={f.rightEl}
            />
          ))}

          <button type="submit" style={styles.btn}>
            Sign In <span style={{ marginLeft: 8 }}>→</span>
          </button>
        </form>

        <Divider />

        <div style={styles.googleWrap}>
          <button style={styles.googleBtn} type="button">
            <Image src="/google.png" alt="Google" width={20} height={20} />
            Continue with Google
          </button>
        </div>

        <p style={styles.footerText}>
          Don’t have an account?{" "}
          <Link href="/register" style={styles.footerLink}>
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div style={styles.page}>
      <div style={styles.gridBg} />
      <main style={styles.card}>
        <div style={styles.twoCol}>
          <LeftPanel />
          <RightPanel />
        </div>
      </main>
    </div>
  );
}
