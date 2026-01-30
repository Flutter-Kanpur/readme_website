import Link from "next/link";

export default function Footer() {

  const footerLinks = [
  { name: "Help", href: "/help" },
  { name: "Status", href: "/status" },
  { name: "Writers", href: "/writers" },
  { name: "Privacy", href: "/privacy" },
  { name: "Terms", href: "/terms" }
];

  return (
    <footer className="w-full bg-white border-t border-gray-200">
      {/* Box container */}
      <div className="max-w-7xl mx-auto px-6 py-20 text-center text-black">
        <h2 className="text-3xl font-semibold mb-10">Readme</h2>

        <div className="flex flex-wrap justify-center gap-12 mb-10">
          {footerLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm tracking-widest uppercase hover:opacity-70"
        >
          {link.name}
        </Link>
      ))}
        </div>
      </div>
    </footer>
  );
}