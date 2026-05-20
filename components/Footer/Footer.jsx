import Link from "next/link";
import Image from "next/image";
import "./styles.css";

const FOOTER_LINKS = [
  { name: "Help", href: "/help" },
  { name: "Status", href: "/status" },
  { name: "Writers", href: "/writers" },
  { name: "Privacy", href: "/privacy" },
  { name: "Terms", href: "/terms" }
];

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo-box">
            <Image
              src="/assets/icons/logo.svg"
              width={24}
              height={24}
              alt="logo"
            />
          </div>
          <h2 className="brand-name">Readme</h2>
        </div>
        
        <p className="footer-tagline">
          Made with <span className="heart">❤️</span> by Flutter Kanpur
        </p>

        <div className="footer-nav">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="footer-nav-link"
            >
              {link.name}
            </Link>
          ))}
        </div>
        
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} Readme • All rights reserved
        </div>
      </div>
    </footer>
  );
}
