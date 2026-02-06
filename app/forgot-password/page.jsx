"use client";

import { useState } from "react";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import LeftPanel from "@/components/auth/LeftPanel";
import PrimaryButton from "@/components/auth/PrimaryButton";
import styles from "@/styles/auth.module.css";
import { supabase } from "@/app/lib/supabase";

function mapResetError(error) {
  const msg = (error?.message || "").toLowerCase();
  if (error?.status === 429 || msg.includes("too many requests"))
    return "Too many attempts. Please wait a minute and try again.";
  if (msg.includes("invalid email")) return "Please enter a valid email.";
  return error?.message || "Could not send reset email. Please try again.";
}

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        },
      );

      if (error) {
        setMessage({ type: "error", text: mapResetError(error) });
        return;
      }

      
      setMessage({
        type: "success",
        text: "If an account exists for this email, a reset link has been sent.",
      });
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
            <h2 className={styles.h2}>Forgot password</h2>
            <p className={styles.p}>
              Enter your email to receive a reset link.
            </p>
          </header>

          <form className={styles.form} onSubmit={handleSend}>
            <div>
              <label className={styles.label}>EMAIL ADDRESS</label>
              <input
                type="email"
                className={styles.input}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <PrimaryButton type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send reset link →"}
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

          <p className={styles.footerText}>
            <Link href="/" className={styles.footerLink}>
              ← Back to sign in
            </Link>
          </p>
        </div>
      </section>
    </AuthLayout>
  );
}
