"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
import styles from "@/styles/auth.module.css";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [ready, setReady] = useState(false);

  
  useEffect(() => {
    const run = async () => {
      setMessage(null);

      try {
        
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            setMessage({
              type: "error",
              text: "Reset link is invalid or expired. Please request a new one.",
            });
            setReady(false);
            return;
          }
        }

        
        const { data } = await supabase.auth.getSession();
        if (!data?.session) {
          setMessage({
            type: "error",
            text: "Auth session missing. Please open the latest reset link again or request a new one.",
          });
          setReady(false);
          return;
        }

        setReady(true);
      } catch {
        setMessage({
          type: "error",
          text: "Something went wrong. Please request a new reset link.",
        });
        setReady(false);
      }
    };

    run();
  }, []);


  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!ready || loading) return;

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setMessage({ type: "error", text: error.message });
        return;
      }

      setMessage({
        type: "success",
        text: "Password updated successfully! You can sign in now.",
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
    <div className={styles.page}>
      <main className={styles.card} style={{ maxWidth: 520 }}>
        <div style={{ padding: 28 }}>
          <h2 className={styles.h2}>Reset password</h2>
          <p className={styles.p}>Enter a new password for your account.</p>

          <form className={styles.form} onSubmit={handleUpdatePassword}>
            <div>
              <label className={styles.label}>NEW PASSWORD</label>
              <input
                className={styles.input}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={!ready}
              />
            </div>

            <button
              className={styles.btn}
              type="submit"
              disabled={!ready || loading}
            >
              {loading ? "Updating..." : "Update password →"}
            </button>
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
            <Link href="/login" className={styles.footerLink}>
              ← Back to sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
