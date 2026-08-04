import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Served under /blogs for Flutter Kanpur site + mobile app deep links.
  // Standalone visits to readme.flutterkanpur.in/ also reach the home page
  // via the root redirect below (basePath: false so it matches outside /blogs).
  //
  // App Links / Universal Links files must also be reachable at the domain
  // root (/.well-known/*). Handled by proxy.js + vercel.json (Next forbids
  // basePath:false rewrites to internal destinations).
  basePath: "/blogs",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/blogs",
        permanent: false,
        basePath: false,
      },
    ];
  },
  // Proxy root well-known → files under /blogs (external URL form required
  // when basePath: false). Works in prod; local uses proxy.js instead.
  async rewrites() {
    const origin =
      process.env.NEXT_PUBLIC_SITE_ORIGIN ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "https://readme.flutterkanpur.in");
    return [
      {
        source: "/.well-known/assetlinks.json",
        destination: `${origin}/blogs/.well-known/assetlinks.json`,
        basePath: false,
      },
      {
        source: "/.well-known/apple-app-site-association",
        destination: `${origin}/blogs/.well-known/apple-app-site-association`,
        basePath: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "uktnmjykbyuvfsbtawwg.supabase.co",
      },
      // If you also use Supabase Storage, add:
      // {
      //   protocol: 'https',
      //   hostname: 'YOUR_PROJECT_ID.supabase.co',
      // },
    ],
  },
};

export default nextConfig;
