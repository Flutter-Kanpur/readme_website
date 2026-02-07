"use client";

import { useState } from "react";
import Link from "next/link";
import AuthLayout from "../../components/auth/AuthLayout";
import LeftPanel from "../../components/auth/LeftPanel";
import Field from "../../components/auth/Field";
import Divider from "../../components/auth/Divider";
import PrimaryButton from "../../components/auth/PrimaryButton";
import GoogleButton from "../../components/auth/GoogleButton";
import styles from "../../styles/auth.module.css";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleChange = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email.trim(),
        password: form.password,
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
        return;
      }

      setMessage({ type: "success", text: "Signed in successfully!" });
      setIsLoggedIn(true);
      router.push("/");
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <LeftPanel />

      <section className={styles.right}>
        <div className={styles.rightInner}>
          <header className={styles.headingWrap}>
            <h2 className={styles.h2}>Welcome back</h2>
            <p className={styles.p}>Please enter your details to sign in.</p>
          </header>

          <form className={styles.form} onSubmit={handleSignIn}>
            <Field
              label="EMAIL ADDRESS"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            <Field
              label="PASSWORD"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              rightEl={
                <Link href="/forgot-password" className={styles.linkSmall}>
                  FORGOT PASSWORD?
                </Link>
              }
            />

            <PrimaryButton type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In →"}
            </PrimaryButton>
          </form>

          {message && (
            <p
              style={{
                marginTop: 12,
                color: message.type === "error" ? "#EF4444" : "#22C55E",
                fontSize: 14,
              }}
            >
              {message.text}
            </p>
          )}

          <Divider />
          <GoogleButton disabled={loading} />

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
