import Link from "next/link";
import Image from "next/image";
import { PLAY_STORE_URL } from "@/app/lib/playStore";
import rawIcon from "@/app/raw-icon.png";
import "./styles.css";

const EXPLORE_LINKS = [
  { name: "Articles", href: "/articles" },
  { name: "Communities", href: "/communities" },
  { name: "Writers", href: "/writers" },
  { name: "Help", href: "/help" },
];

const LEGAL_LINKS = [
  { name: "Privacy policy", href: "/privacy" },
  { name: "Terms of service", href: "/terms" },
];

const CONTACT_EMAIL = "readme.flutterkanpur@gmail.com";

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="footer-content">
        <div className="footer-grid">
          <div className="footer-col footer-col--brand">
            <Link href="/" className="footer-brand">
              <span className="footer-logo-box">
                <Image
                  src={rawIcon}
                  width={72}
                  height={72}
                  alt="Readme by Flutter Kanpur"
                />
              </span>
            </Link>
            <div className="footer-brand-text">
              <p className="footer-tagline">
                A reader-first community for learning, building, and growing
                through articles.
              </p>
              <p className="footer-credit">
                Built by{" "}
                <a
                  href="https://flutterkanpur.in"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Flutter Kanpur
                </a>
              </p>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <h3 className="footer-heading">Explore</h3>
              <ul className="footer-stack">
                {EXPLORE_LINKS.map((link) => (
                  <li key={link.href} className="footer-stack__row">
                    <Link href={link.href}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h3 className="footer-heading">Legal</h3>
              <ul className="footer-stack">
                {LEGAL_LINKS.map((link) => (
                  <li key={link.href} className="footer-stack__row">
                    <Link href={link.href}>{link.name}</Link>
                  </li>
                ))}
                <li className="footer-stack__row">
                  <span className="footer-subheading">Talk to us</span>
                </li>
                <li className="footer-stack__row">
                  <a className="footer-email" href={`mailto:${CONTACT_EMAIL}`}>
                    {CONTACT_EMAIL}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-col footer-col--app">
            <div className="footer-app-copy-wrap">
              <h3 className="footer-heading">Get the app</h3>
              <p className="footer-app-copy">
                Read and write on the go with the Readme Android app.
              </p>
            </div>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-play"
            >
              <Image
                src="/assets/icons/google-play.png"
                alt=""
                width={40}
                height={40}
                className="footer-play__icon"
              />
              <span className="footer-play__text">
                <span className="footer-play__label">Get it on</span>
                <span className="footer-play__store">Google Play</span>
              </span>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} Readme by Flutter Kanpur. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
