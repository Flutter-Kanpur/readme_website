import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import LeftPanel from "@/components/auth/LeftPanel";
import Field from "@/components/auth/Field";
import Divider from "@/components/auth/Divider";
import PrimaryButton from "@/components/auth/PrimaryButton";
import GoogleButton from "@/components/auth/GoogleButton";
import styles from "@/styles/auth.module.css";

export default function Register() {
  const fields = [
    { label: "FULL NAME", type: "text", placeholder: "Jane Doe" },
    { label: "EMAIL ADDRESS", type: "email", placeholder: "name@example.com" },
    { label: "PASSWORD", type: "password", placeholder: "••••••••" },
  ];

  return (
    <AuthLayout>
      <LeftPanel />

      <section className={styles.right}>
        <div className={styles.rightInner}>
          <header className={styles.headingWrap}>
            <h2 className={styles.h2}>Join the community</h2>
            <p className={styles.p}>Start your design journey with Readme today.</p>
          </header>

          <form className={styles.form}>
            {fields.map((f) => (
              <Field key={f.label} {...f} />
            ))}

            <PrimaryButton type="submit">
              Create account <span style={{ marginLeft: 8 }}>→</span>
            </PrimaryButton>
          </form>

          <Divider />
          <GoogleButton />

          <p className={styles.footerText}>
            Already have an account?{" "}
            <Link href="/" className={styles.footerLink}>
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </AuthLayout>
  );
}
