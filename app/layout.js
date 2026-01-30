import localFont from "next/font/local";
import "./globals.css";

const productSans = localFont({
  src: "./fonts/ProductSans-Regular.woff2",
  variable: "--font-product-sans",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={productSans.variable}>
      <body>{children}</body>
    </html>
  );
}
