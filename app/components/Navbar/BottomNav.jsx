"use client";

import Link from "next/link";
import {
  CommunityNavIcon,
  DraftNavIcon,
  ExploreNavIcon,
  HomeNavIcon,
  ProfileNavIcon,
} from "./NavIcons";

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
      icon: HomeNavIcon,
      isActive: pathname === "/",
    },
    {
      label: "Explore",
      href: "/articles",
      icon: ExploreNavIcon,
      isActive: pathname?.startsWith("/articles"),
    },
    ...(user
      ? [
          {
            label: "Drafts",
            href: "/drafts",
            icon: DraftNavIcon,
            isActive: pathname?.startsWith("/drafts"),
          },
        ]
      : []),
    {
      label: "Community",
      href: "/communities",
      icon: CommunityNavIcon,
      isActive: pathname?.startsWith("/communities") || pathname?.startsWith("/writers"),
    },
    {
      label: "Profile",
      href: profileHref,
      icon: ProfileNavIcon,
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
            <Icon className="bottom-nav__icon" />
            <span className="bottom-nav__label">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
