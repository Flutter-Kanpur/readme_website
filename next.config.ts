import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Served under /blogs on the main Flutter Kanpur site (reverse-proxy).
  basePath: "/blogs",
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
