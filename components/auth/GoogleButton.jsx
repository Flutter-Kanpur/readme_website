"use client";

import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/app/lib/supabase";
import { absoluteAppUrl } from "@/app/lib/basePath";
import googleIcon from "@/public/assets/icons/google.svg";

export default function GoogleButton({ disabled = false }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    if (loading || disabled) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: absoluteAppUrl("/auth/callback"),
        },
      });

      if (oauthError) {
        setError(oauthError.message);
        return;
      }

      if (data?.url) {
        window.location.assign(data.url);
      }
    } catch (err) {
      setError(err?.message || "Could not start Google sign-in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={disabled || loading}
        style={{
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
          cursor: disabled || loading ? "not-allowed" : "pointer",
          opacity: disabled || loading ? 0.6 : 1,
        }}
      >
        <Image
          src={googleIcon}
          alt=""
          width={20}
          height={20}
          aria-hidden
        />
        {loading ? "Redirecting…" : "Continue with Google"}
      </button>
      {error ? (
        <p
          style={{
            marginTop: 10,
            color: "#EF4444",
            fontSize: 13,
            lineHeight: 1.4,
          }}
        >
          {error}
        </p>
      ) : null}
    </>
  );
}
