"use client";

import { useState } from "react";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import LeftPanel from "@/components/auth/LeftPanel";
import Field from "@/components/auth/Field";
import Divider from "@/components/auth/Divider";
import PrimaryButton from "@/components/auth/PrimaryButton";
import GoogleButton from "@/components/auth/GoogleButton";
import styles from "@/styles/auth.module.css";
import { supabase } from "../lib/supabase";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (key, value) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          data: {
            full_name: form.name,
          },
        },
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
        return;
      }

      setMessage({
        type: "success",
        text: "Account created successfully!",
      });
      // router.push("/dashboard")
    } catch {
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
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
            <h2 className={styles.h2}>Join the community</h2>
            <p className={styles.p}>
              Start your design journey with Readme today.
            </p>
          </header>

          <form className={styles.form} onSubmit={handleSignUp}>
            <Field
              label="FULL NAME"
              type="text"
              placeholder="Jane Doe"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />

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
            />

            <PrimaryButton type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create account →"}
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
