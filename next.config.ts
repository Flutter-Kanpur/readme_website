import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Served under /blogs for Flutter Kanpur site + mobile app deep links.
  // Standalone visits to readme.flutterkanpur.in/ also reach the home page
  // via the root redirect below (basePath: false so it matches outside /blogs).
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
