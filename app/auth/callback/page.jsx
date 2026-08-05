"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { getSafeSession } from "@/app/lib/supabase/auth";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Completing sign-in…");

  useEffect(() => {
    let cancelled = false;

    async function finishAuth() {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const authError =
          url.searchParams.get("error_description") ||
          url.searchParams.get("error");

        if (authError) {
          if (!cancelled) {
            setMessage("Sign-in was cancelled or failed.");
            router.replace(`/login?error=${encodeURIComponent(authError)}`);
          }
          return;
        }

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            if (!cancelled) {
              router.replace(
                `/login?error=${encodeURIComponent(error.message)}`,
              );
            }
            return;
          }
        }

        const session = await getSafeSession();
        if (!session) {
          if (!cancelled) {
            router.replace(
              "/login?error=" +
                encodeURIComponent(
                  "Could not establish a session. Please try again.",
                ),
            );
          }
          return;
        }

        if (!cancelled) {
          router.replace("/");
          router.refresh();
        }
      } catch (error) {
        if (!cancelled) {
          router.replace(
            `/login?error=${encodeURIComponent(
              error?.message || "Sign-in failed. Please try again.",
            )}`,
          );
        }
      }
    }

    finishAuth();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        color: "#374151",
        fontSize: 15,
      }}
    >
      {message}
    </main>
  );
}
