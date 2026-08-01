"use client";

import Image from "next/image";
import { supabase } from "@/app/lib/supabase";
import { absoluteAppUrl } from "@/app/lib/basePath";
import googleIcon from "@/public/assets/icons/google.svg";

export default function GoogleButton({ disabled = false }) {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: absoluteAppUrl("/"),
      },
    });
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={disabled}
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
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <Image
        src={googleIcon}
        alt=""
        width={20}
        height={20}
        aria-hidden
      />
      Continue with Google
    </button>
  );
}
