"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/app/lib/supabase";


const NAV_LINKS = [
  { label: "Home", href: "/", active: true },
  { label: "Articles", href: "/articles" },
  { label: "Search", href: "/search" },
  { label: "Trending", href: "/trending" }
]

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Initial session check
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
    });

    // Listen for login/logout
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">


        <div className="text-xl font-bold text-black">Readme</div>


        <div className="hidden md:flex gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-600 hover:text-black"
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link
              href={`/profile/${user.id}`}
              className="text-gray-600 hover:text-black"
            >
              Profile
            </Link>
          )}
        </div>


        {user ? (
          <UserAvatar user={user} />
        ) : (
          <Link
            href="/login"
            className="bg-black text-white px-4 py-2 rounded-full text-sm"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

function UserAvatar({ user }) {
  return (
    <div className="flex items-center gap-3 cursor-pointer">
      <Image
        src={user.user_metadata?.avatar_url || "/avatar.png"}
        alt="User avatar"
        width={36}
        height={36}
        className="rounded-full"
      />


      <button
        onClick={() => supabase.auth.signOut()}
        className="bg-black text-white px-4 py-2 rounded-full text-sm"
      >
        Logout
      </button>
    </div>
  );
}
