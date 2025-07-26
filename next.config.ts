import type { NextConfig } from "next";

// Extract the hostname from the Supabase URL
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseHostname = supabaseUrl.replace(/^https?:\/\//, '').split('/')[0];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHostname,
        port: '',
        pathname: '/storage/v1/object/public/prompt-images/**',
      },
    ],
  },
};

export default nextConfig;
