import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'i.pravatar.cc','images.unsplash.com','lh3.googleusercontent.com','uktnmjykbyuvfsbtawwg.supabase.co'
      // If you also use Supabase Storage, add:
      // 'YOUR_PROJECT_ID.supabase.co'
    ]
  }
};

export default nextConfig;
