"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import BottomNav from "./BottomNav";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Articles", href: "/articles", matchPrefix: true },
  { label: "Communities", href: "/communities", matchPrefix: true },
];

function isNavLinkActive(pathname, link) {
  if (link.matchPrefix) {
    return pathname === link.href || pathname?.startsWith(`${link.href}/`);
  }
  return pathname === link.href;
}

function getDisplayName(user) {
  return (
    user?.user_metadata?.username ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User"
  );
}

function useClickOutside(ref, onClose) {
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, onClose]);
}

function DropdownNavLinks({ pathname, user, mounted, onNavigate }) {
  return (
    <div className="navbar-pill__dropdown-nav">
      {NAV_LINKS.map((link) => {
        const isActive = isNavLinkActive(pathname, link);
        return (
          <Link
            key={link.href}
            href={link.href}
            role="menuitem"
            onClick={onNavigate}
            className={`navbar-pill__dropdown-item${isActive ? " navbar-pill__dropdown-item--active" : ""}`}
          >
            {link.label}
          </Link>
        );
      })}
      {mounted && user && (
        <Link
          href="/drafts"
          role="menuitem"
          onClick={onNavigate}
          className={`navbar-pill__dropdown-item${pathname === "/drafts" ? " navbar-pill__dropdown-item--active" : ""}`}
        >
          Drafts
        </Link>
      )}
    </div>
  );
}

function NavDropdown({ open, onClose, trigger, children }) {
  const ref = useRef(null);
  useClickOutside(ref, onClose);

  return (
    <div ref={ref} className="relative flex shrink-0 items-center">
      {trigger}
      {open && (
        <div role="menu" className="navbar-pill__dropdown">
          {children}
        </div>
      )}
    </div>
  );
}

function UserProfile({ user, onSignOut, pathname, mounted }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const avatarSrc =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    "/avatar.jpg";

  return (
    <NavDropdown
      open={open}
      onClose={close}
      trigger={
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-8 items-center gap-2 m-0 p-0 border-0 bg-transparent whitespace-nowrap cursor-pointer rounded-full hover:bg-gray-50 transition-colors leading-none"
          aria-expanded={open}
          aria-haspopup="menu"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarSrc}
            alt=""
            width={32}
            height={32}
            className="block h-8 w-8 shrink-0 rounded-full object-cover"
          />
          <span className="navbar-pill__profile-name hidden md:inline text-sm leading-none text-gray-800 font-normal max-w-[120px] lg:max-w-[160px] truncate">
            {getDisplayName(user)}
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-[#4285F4] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            strokeWidth={2.5}
          />
        </button>
      }
    >
      <DropdownNavLinks
        pathname={pathname}
        user={user}
        mounted={mounted}
        onNavigate={close}
      />
      <Link
        href={`/profile/${user.id}`}
        role="menuitem"
        onClick={close}
        className="navbar-pill__dropdown-item"
      >
        Profile
      </Link>
      <button
        type="button"
        role="menuitem"
        onClick={() => {
          close();
          onSignOut();
        }}
        className="navbar-pill__dropdown-item cursor-pointer border-0 bg-transparent"
      >
        Log out
      </button>
    </NavDropdown>
  );
}

export default function Navbar({ hideBottomNav = false } = {}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  useEffect(() => {
    setMounted(true);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const navLinkClass = (isActive) =>
    isActive
      ? "text-black font-semibold"
      : "text-gray-500 font-normal hover:text-gray-800";

  const linkBaseClass =
    "navbar-pill__link inline-flex h-8 items-center text-sm leading-none transition-colors shrink-0";

  return (
    <>
    <header className="top-navbar relative z-10 w-full pt-4 px-4 sm:px-6 md:px-8">
      <nav
        aria-label="Main"
        className="navbar-pill max-w-6xl mx-auto h-14 md:h-[60px] px-5 md:px-8 bg-white border border-gray-200 rounded-full shadow-sm"
      >
        <div className="navbar-pill__row">
          {/* Left — logo + brand */}
          <Link
            href="/"
            className="navbar-pill__start gap-2.5 transition-transform active:scale-95"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-black p-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/icons/logo.svg"
                alt=""
                width={40}
                height={40}
                className="block h-5 w-5 max-h-5 max-w-5 object-contain"
              />
            </span>
            <span className="navbar-pill__brand shrink-0">Readme</span>
          </Link>

          {/* Center — desktop links only */}
          <div className="navbar-pill__center">
            {NAV_LINKS.map((link) => {
              const isActive = isNavLinkActive(pathname, link);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${linkBaseClass} ${navLinkClass(isActive)}`}
                >
                  {link.label}
                </Link>
              );
            })}
            {mounted && user && (
              <Link
                href="/drafts"
                className={`${linkBaseClass} ${navLinkClass(pathname === "/drafts")}`}
              >
                Drafts
              </Link>
            )}
          </div>

          {/* Right — profile / login */}
          <div className="navbar-pill__end">
            {mounted && !loading && (
              <>
                {user ? (
                  <UserProfile
                    user={user}
                    onSignOut={handleSignOut}
                    pathname={pathname}
                    mounted={mounted}
                  />
                ) : (
                  <Link href="/login" className="top-navbar__login">
                    Login
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
    {!hideBottomNav && <BottomNav user={user} pathname={pathname} />}
    </>
  );
}
