"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import { getProfileById } from "@/app/lib/supabase/queries";

const NAV_LINKS = [
  { label: "Home", href: "/", active: true },
  { label: "Articles", href: "/#latest-articles" },
  { label: "Trending", href: "/trending" },
  // { label: "Profile", href: "/profile" },
];

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
      },
    );

    // const profileData = await getProfileById(user.id)

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="bg-black p-1 rounded-sm">
            <Image
              src="/assets/icons/logo.svg"
              width={28}
              height={28}
              alt="logo"
            />
          </div>

          <span className="text-2xl font-bold">Readme</span>
        </Link>
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
            <>
              <Link
                href="/drafts"
                className="text-gray-600 hover:text-black"
              >
                Drafts
              </Link>
              <Link
                href={`/profile/${user.id}`}
                className="text-gray-600 hover:text-black"
              >
                Profile
              </Link>
            </>
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
  const router = useRouter();
  return (
    <div className="flex items-center gap-3 cursor-pointer">
      <Image
        src={user.avatar_url?.user_metadata || "/avatar.jpg"}
        alt="User avatar"
        width={36}
        height={36}
        className="rounded-full"
      />

      <button
        // onClick={() => supabase.auth.signOut()}
        // onClick= {handleLogout}
        onClick={async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }}
        className="bg-black text-white px-4 py-2 rounded-full text-sm cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
}
