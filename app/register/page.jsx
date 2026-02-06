"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AuthLayout from "@/components/auth/AuthLayout";
import LeftPanel from "@/components/auth/LeftPanel";
import Field from "@/components/auth/Field";
import Divider from "@/components/auth/Divider";
import PrimaryButton from "@/components/auth/PrimaryButton";
import GoogleButton from "@/components/auth/GoogleButton";

import styles from "@/styles/auth.module.css";
import { supabase } from "@/app/lib/supabase";

function mapSignUpError(error) {
  const msg = (error?.message || "").toLowerCase();

  if (error?.status === 429 || msg.includes("too many requests"))
    return "Too many attempts. Please wait a minute and try again.";

  if (
    msg.includes("user already registered") ||
    msg.includes("already registered")
  )
    return "User already exists! Please sign in instead.";

  if (msg.includes("invalid email"))
    return "Please enter a valid email address.";

  if (
    msg.includes("password") &&
    (msg.includes("at least") || msg.includes("should"))
  )
    return error.message;

  return error?.message || "Sign up failed. Please try again.";
}

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setMessage(null);

    const name = form.name.trim();
    const email = form.email.trim();
    const password = form.password;

    // ✅ simple client validations
    if (!name) {
      setMessage({ type: "error", text: "Please enter your full name." });
      setLoading(false);
      return;
    }
    if (!email) {
      setMessage({ type: "error", text: "Please enter your email." });
      setLoading(false);
      return;
    }
    if (!password) {
      setMessage({ type: "error", text: "Please enter your password." });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });

      if (error) {
        setMessage({ type: "error", text: mapSignUpError(error) });
        return;
      }

      // You said email verification is disabled → user should be able to sign in
      setMessage({
        type: "success",
        text: "Account created successfully! Please sign in.",
      });

      // optional: redirect after short delay
      setTimeout(() => router.push("/"), 600);
    } catch (err) {
      // ✅ show real error instead of hiding it
      setMessage({
        type: "error",
        text: err?.message || "Something went wrong. Please try again.",
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
            <Link href="/login" className={styles.footerLink}>
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </AuthLayout>
  );
}
