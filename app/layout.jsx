import { Google_Sans } from "next/font/google";
import "./globals.css";
import ScrollToTopOnNavigate from "@/components/ScrollToTopOnNavigate";

const googleSans = Google_Sans({
  variable: "--font-google-sans",
  subsets: ["latin"],
  display: "swap",
});

const SITE_NAME = "Readme";
const SITE_DESCRIPTION =
  "Community-first publishing platform for creators — by Flutter Kanpur.";

export const metadata = {
  metadataBase: new URL("https://readme.flutterkanpur.in"),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/assets/og-default.jpg",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/assets/og-default.jpg"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "overlays-content",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={googleSans.variable}
    >
      <body className={`${googleSans.className} antialiased`}>
        <ScrollToTopOnNavigate />
        <div id="app-scroll">
          {children}
        </div>
      </body>
    </html>
  );
}
