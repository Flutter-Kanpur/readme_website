"use client";

import Link from "next/link";
import { Home, Users, Search, User } from "lucide-react";

/**
 * Mobile bottom tab bar. Rendered by Navbar and gated to `md:hidden`,
 * so it's only visible below the 768px breakpoint.
 *
 * Active-tab matching uses prefix tests so nested routes
 * (e.g. /articles/[blogId], /profile/[userId]/editprofile) keep the
 * correct tab highlighted.
 */
export default function BottomNav({ user, pathname }) {
  const profileHref = user ? `/profile/${user.id}` : "/login";
  const profileActive =
    pathname?.startsWith("/profile") ||
    (!user && (pathname === "/login" || pathname === "/register"));

  const tabs = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Community",
      href: "/communities",
      icon: Users,
      isActive: pathname?.startsWith("/communities") || pathname?.startsWith("/writers"),
    },
    {
      label: "Explore",
      href: "/articles",
      icon: Search,
      isActive: pathname?.startsWith("/articles"),
    },
    {
      label: "Profile",
      href: profileHref,
      icon: User,
      isActive: profileActive,
    },
  ];

  return (
    <nav className="bottom-nav md:hidden" aria-label="Primary">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <Link
            key={tab.label}
            href={tab.href}
            className={`bottom-nav__tab${tab.isActive ? " bottom-nav__tab--active" : ""}`}
            aria-current={tab.isActive ? "page" : undefined}
          >
            <Icon
              className="bottom-nav__icon"
              aria-hidden="true"
              strokeWidth={tab.isActive ? 2.5 : 2}
            />
            <span className="bottom-nav__label">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
