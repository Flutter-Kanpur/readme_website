"use client";

import { useState } from "react";
import Link from "next/link";
import AuthLayout from "../components/auth/AuthLayout";
import LeftPanel from "../components/auth/LeftPanel";
import Field from "../components/auth/Field";
import Divider from "../components/auth/Divider";
import PrimaryButton from "../components/auth/PrimaryButton";
import GoogleButton from "../components/auth/GoogleButton";
import styles from "../styles/auth.module.css";
import { supabase } from "./lib/supabase";

function mapSignInError(error) {
  const msg = (error?.message || "").toLowerCase();
  const status = error?.status;

  if (status === 429 || msg.includes("too many requests")) {
    return "Too many attempts. Please wait a minute and try again.";
  }

  // Supabase commonly uses this for both wrong password & user-not-found.
  if (msg.includes("invalid login credentials")) {
    return "Invalid email or password. If you’re new, please sign up first.";
  }

  if (msg.includes("email not confirmed")) {
    return "Your email is not confirmed. Please check your inbox.";
  }

  return error?.message || "Sign in failed. Please try again.";
}

export default function Home() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setMessage(null);

    const email = form.email.trim();
    const password = form.password;

    if (!email || !password) {
      setMessage({ type: "error", text: "Please enter email and password." });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage({ type: "error", text: mapSignInError(error) });
        return;
      }

      setMessage({ type: "success", text: "Signed in successfully!" });
      // router.push("/dashboard")
    } catch {
      setMessage({ type: "error", text: "Something went wrong. Try again." });
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
                <Link href="#" className={styles.linkSmall}>
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
