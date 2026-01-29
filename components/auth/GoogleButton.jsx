"use client";

import Image from "next/image";
import { supabase } from "@/app/lib/supabase";

export default function GoogleButton({ disabled = false }) {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/dashboard",
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
      <Image src="/google.png" alt="Google" width={20} height={20} />
      Continue with Google
    </button>
  );
}
