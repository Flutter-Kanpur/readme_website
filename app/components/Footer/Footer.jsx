import Link from "next/link";
import Image from "next/image";

const FOOTER_LINKS = [
  { label: "Help", href: "/help" },
  { label: "Status", href: "/status" },
  { label: "Writers", href: "/writers" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-20 text-center text-black">
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="bg-black w-10 h-10 rounded-lg flex items-center justify-center">
            <Image
              src="/assets/icons/logo.svg"
              width={30}
              height={30}
              alt="logo"
            />
          </div>

          <h2 className="text-3xl font-semibold">Readme</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-12 mb-10">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm tracking-widest uppercase hover:opacity-70"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
