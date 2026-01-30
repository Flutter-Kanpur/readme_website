import Link from "next/link";
import "./styles.css";

export default function Footer() {
  const footerLinks = [
    { name: "Help", href: "/help" },
    { name: "Status", href: "/status" },
    { name: "Writers", href: "/writers" },
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" }
  ];

  return (
    <footer className="footer">
      {/* Box container */}
      <div className="footer-container">
        <h2 className="footer-title">Readme</h2>

        <div className="footer-links">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="footer-link"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
