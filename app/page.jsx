import Link from "next/link";
import AuthLayout from "../components/auth/AuthLayout";
import LeftPanel from "../components/auth/LeftPanel";
import Field from "../components/auth/Field";
import Divider from "../components/auth/Divider";
import PrimaryButton from "../components/auth/PrimaryButton";
import GoogleButton from "../components/auth/GoogleButton";
import styles from "../styles/auth.module.css";
import GridBackground from "@/components/ui/GridBackground";



export default function Home() {
  const fields = [
    { label: "EMAIL ADDRESS", type: "email", placeholder: "name@example.com" },
    {
      label: "PASSWORD",
      type: "password",
      placeholder: "••••••••",
      rightEl: (
        <Link href="#" className={styles.linkSmall}>
          FORGOT PASSWORD?
        </Link>
      ),
    },
  ];

  return (
    <AuthLayout>
      <LeftPanel />

      <section className={styles.right}>
        <div className={styles.rightInner}>
          <header className={styles.headingWrap}>
            <h2 className={styles.h2}>Welcome back</h2>
            <p className={styles.p}>Please enter your details to sign in.</p>
          </header>

          <form className={styles.form}>
            {fields.map((f) => (
              <Field key={f.label} {...f} />
            ))}

            <PrimaryButton type="submit">
              Sign In <span style={{ marginLeft: 8 }}>→</span>
            </PrimaryButton>
          </form>

          <Divider />
          <GoogleButton />

          <p className={styles.footerText}>
            Don’t have an account?{" "}
            <Link href="/register" className={styles.footerLink}>
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </AuthLayout>
  );
}
