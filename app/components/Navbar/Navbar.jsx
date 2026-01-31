import Link from "next/link";

const NAV_LINKS = [
  { label: "Home", href: "/", active: true },
  { label: "Articles", href: "/articles" },
  { label: "Community", href: "/community" },
  { label: "Events", href: "/events" },
  { label: "Team", href: "/team" },
];

export default function Navbar() {
  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="text-xl font-bold text-black">
          Readme
        </div>
        <div className="hidden md:flex gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                link.active
                  ? "text-blue-500 font-medium"
                  : "text-gray-600 hover:text-black"
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
        <Link
          href="/login"
          className="bg-black text-white px-4 py-2 rounded-full text-sm"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}
